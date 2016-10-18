using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;
using System.Net;
using Gloobster.DomainModels.Wiki;
using Gloobster.Enums;
using Nito.AsyncEx;

namespace Gloobster.DomainModels.Services.Accounts
{
    public class SocNetworkService : ISocNetworkService
    {
        private readonly AsyncLock _mutex = new AsyncLock();

        public ILogger Log { get; set; }

        public IDbOperations DB { get; set; }
        public ISocLogin SocLogin { get; set; }
        public IFilesDomain FileDomain { get; set; }
        public IAvatarPhoto AvatarPhoto { get; set; }
        
        public IAccountDomain AccountDomain { get; set; }

        public INewAccountCreator NewAccCreator { get; set; }

        private void AddLog(string log)
        {
            Log.Debug($"SocNetworkService: {log}");
        }

        public async Task<LoginResponseDO> HandleAsync(SocAuthDO auth)
        {
            ((NewAccountCreator) NewAccCreator).SocLogin = SocLogin;

            try
            {
                SocLogin.Init(auth);
                AddLog("Initialized");
                var tokenResult = SocLogin.ValidateToken(auth);
                bool isTokenValid = tokenResult.IsValid && (auth.SocUserId == tokenResult.UserId);
                AddLog("TokenValid: " + isTokenValid);
                if (!isTokenValid)
                {
                    return Unsuccess();
                }
                
                var socAccount1 = DB.FOD<SocialAccountEntity>(a => a.UserId == auth.SocUserId && a.NetworkType == auth.NetType);
                bool socAccountExists = socAccount1 != null;
                AddLog("socAccountExists: " + socAccountExists);
                if (socAccountExists)
                {
                    LoginResponseDO res = await SocAccountExists(auth, socAccount1);
                    return res;
                }

                //since here creating new soc account
                using (await _mutex.LockAsync())
                {
                    AddLog("Entering create lock");
                    var socAccount = DB.FOD<SocialAccountEntity>(a => a.UserId == auth.SocUserId && a.NetworkType == auth.NetType);

                    bool socAccountNew = socAccount == null;
                    if (socAccountNew)
                    {
                        AddLog("Creating new account");
                        LoginResponseDO res = await SocAccountNew(auth);

                        AddLog($"saving profile picture");                        
                        SaveProfilePicture(auth);  

                        return res;
                    }

                    return Unsuccess();
                }                
            }
            catch (Exception exc)
            {
                AddLog($"HandleAsync: exception : {exc.Message}");
                return Unsuccess();
            }
        }



        public async Task<LoginResponseDO> HandleEmail(string mail, string password, string userId)
        {
            var accountExisting = DB.FOD<AccountEntity>(a => a.Mail == mail);
            bool accountExists = accountExisting != null;
            
            if (accountExists)
            {
                bool authCorrect = (accountExisting.Password == password);
                if (authCorrect)
                {
                    var user = DB.FOD<UserEntity>(u => u.User_id == accountExisting.User_id);
                    var response = new LoginResponseDO
                    {
                        Token = BuildToken(accountExisting.User_id.ToString(), accountExisting.Secret),
                        UserId = userId,
                        DisplayName = user.DisplayName,
                        NetType = SocialNetworkType.Base,
                        SocToken = null,
                        FullRegistration = accountExisting.EmailConfirmed,
                        Successful = true
                    };
                    return response;
                }
                
                return Unsuccess();                
            }
            
            //since here creating new account            
            var newResp = await CreateNewFromEmail(userId, mail, password);
            return newResp;                        
        }

        private async Task<LoginResponseDO> CreateNewFromEmail(string userId, string mail, string password)
        {
            var userIdObj = new ObjectId(userId);
            var account = DB.FOD<AccountEntity>(a => a.User_id == userIdObj);

            bool accountHasAlreadyEmail = !string.IsNullOrEmpty(account.Mail);
            if (accountHasAlreadyEmail)
            {
                return Unsuccess();
            }

            if (!MailValid(mail))
            {
                return Unsuccess();
            }

            bool created = await NewAccCreator.CreateUserFromMail(userId, mail, password);
            if (!created)
            {
                return Unsuccess();
            }

            var response = new LoginResponseDO
            {
                Token = BuildToken(account.User_id.ToString(), account.Secret),
                UserId = userId,
                DisplayName = ((NewAccountCreator)NewAccCreator).NewUserEntity.DisplayName,
                NetType = SocialNetworkType.Base,
                SocToken = null,
                FullRegistration = false,
                Successful = true
            };
            return response;
        }

        private LoginResponseDO Unsuccess()
        {
            return new LoginResponseDO { Successful = false };
        }

        public async Task<bool> Unpair(string userId, SocialNetworkType type)
        {
            var userIdObj = new ObjectId(userId);

            bool deleted = await DB.DeleteAsync<SocialAccountEntity>(u => u.User_id == userIdObj && u.NetworkType == type);
            return deleted;
        }
        
        private async void MarkEmptyAccount(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var f1 = DB.F<AccountEntity>().Eq(a => a.User_id, userIdObj);
            var u1 = DB.U<AccountEntity>().Set(a => a.PossiblyEmpty, true);
            await DB.UpdateAsync(f1, u1);
        }
        
        private bool MailValid(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsFullRegistration(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var account = DB.FOD<AccountEntity>(a => a.User_id == userIdObj);
            if (account != null && account.EmailConfirmed)
            {                
                return true;
            }
            
            var socAccounts = AccountDomain.GetAuths(userId);
            if (socAccounts.Any())
            {             
                return true;
            }

            return false;
        }


        private async Task<LoginResponseDO> SocAccountNew(SocAuthDO auth)
        {
            var creator = ((NewAccountCreator)NewAccCreator);

            try
            {
                var userIdObj = new ObjectId(auth.UserId);

                var userEntity = DB.FOD<UserEntity>(u => u.User_id == userIdObj);
                bool isPairing = userEntity != null;
                if (isPairing)
                {
                    bool created = await NewAccCreator.CreateNewSocialAccountEntity(auth);
                    if (!created)
                    {
                        return Unsuccess();
                    }
                    creator.NewUserEntity = userEntity;
                }
                else
                {
                    bool created = await NewAccCreator.CreateUserFromSocNet(auth.UserId, auth);
                    if (!created)
                    {
                        return Unsuccess();
                    }

                    await SocLogin.OnNewUser(auth);
                }
                
                var accountEntity = DB.FOD<AccountEntity>(u => u.User_id == userIdObj);

                var response = new LoginResponseDO
                {
                    Token = BuildToken(auth.UserId, accountEntity.Secret),
                    UserId = auth.UserId,
                    DisplayName = creator.NewUserEntity.DisplayName,
                    NetType = auth.NetType,
                    SocToken = auth.AccessToken,
                    FullRegistration = IsFullRegistration(auth.UserId),
                    Successful = true
                };

                return response;
            }
            catch (Exception exc)
            {
                await creator.RollBack();
                AddLog($"SocAccountNew: exception: {exc.Message}");
                return Unsuccess();
            }
        }
        
        private bool PairingValiation(AccountEntity accountBySocAccount)
        {            
            bool accountWeAreTryingToPairIsAlreadyInUse = accountBySocAccount != null;
            AddLog($"accountWeAreTryingToPairIsAlreadyInUse: {accountWeAreTryingToPairIsAlreadyInUse}");
            if (accountWeAreTryingToPairIsAlreadyInUse)
            {
                return false;                        
            }
            
            return true;
        }

        private bool IsPairing(string userId)
        {
            var authUserObjId = new ObjectId(userId);

            var socAccountsOfUserFromAuth = DB.List<SocialAccountEntity>(a => a.User_id == authUserObjId);

            bool isPairing = socAccountsOfUserFromAuth.Any();
            return isPairing;
        }
        
        //try to fix it before removing - could be executed when pairing
        private async Task UpdateCommunicationAccount(ObjectId userIdObj, string mail)
        {
            var filter = DB.F<UserEntity>().Eq(u => u.User_id, userIdObj);
            var update = DB.U<UserEntity>().Set(u => u.Mail, mail);
            await DB.UpdateAsync(filter, update);
        }

        private async Task<LoginResponseDO> SocAccountExists(SocAuthDO auth, SocialAccountEntity socAccount)
        {
            try
            {
                AddLog("SocAccountExists");

                var authUserObjId = new ObjectId(auth.UserId);
                
                AccountEntity accountBySocAccount = DB.FOD<AccountEntity>(u => u.User_id == socAccount.User_id);

                bool isPairing = IsPairing(auth.UserId);
                if (isPairing)
                {
                    bool pairingOk = PairingValiation(accountBySocAccount);
                    if (!pairingOk)
                    {
                        return new LoginResponseDO { AccountAlreadyInUse = true };
                    }
                    
                    //UpdateCommunicationAccount(authUserObjId, )
                }
                
                AddLog("RenewTokenIfPossible");
                await RenewTokenIfPossible(auth, socAccount.id);
                AddLog("RenewTokenIfPossible done");

                if (authUserObjId != accountBySocAccount.User_id)
                {
                    AddLog("Marking empty account");
                    //here could be delete temp account
                    MarkEmptyAccount(auth.UserId);
                }

                var user = DB.FOD<UserEntity>(u => u.User_id == socAccount.User_id);

                AddLog("Creating response");
                var response = new LoginResponseDO
                {
                    Token = BuildToken(accountBySocAccount.User_id.ToString(), accountBySocAccount.Secret),
                    UserId = accountBySocAccount.User_id.ToString(),
                    DisplayName = user.DisplayName,
                    NetType = auth.NetType,
                    SocToken = auth.AccessToken,
                    FullRegistration = IsFullRegistration(accountBySocAccount.User_id.ToString()),
                    Successful = true
                };
                return response;
            }
            catch (Exception exc)
            {
                AddLog($"SocAccountExists: exception: {exc.Message}");
                return Unsuccess();
            }
        }

        private async Task<bool> RenewTokenIfPossible(SocAuthDO auth, ObjectId socAcountEntityId)
        {
            var permanentToken = SocLogin.TryGetPermanentToken(auth.AccessToken);
            if (permanentToken.Issued)
            {
                var filter = DB.F<SocialAccountEntity>().Eq(s => s.id, socAcountEntityId);
                var u1 = DB.U<SocialAccountEntity>().Set(s => s.AccessToken, permanentToken.PermanentAccessToken);
                var u2 = DB.U<SocialAccountEntity>().Set(s => s.ExpiresAt, permanentToken.NewExpireAt);
                var r1 = await DB.UpdateAsync(filter, u1);
                var r2 = await DB.UpdateAsync(filter, u2);
                return (r1.ModifiedCount == 1) && (r2.ModifiedCount == 1);
            }
            return false;
        }

        private void SaveProfilePicture(SocAuthDO auth)
        {
            try
            {
                var profilePicUrl = SocLogin.GetProfilePicUrl(auth);

                var location = FileDomain.Storage.Combine(AvatarFilesConsts.Location, auth.UserId);

                AvatarPhoto.DeleteOld(location);

                var client = new WebClient();
                var bytes = client.DownloadData(profilePicUrl);
                var bytesStream = new MemoryStream(bytes);
                
                AvatarPhoto.CreateThumbnails(location, bytesStream);
                AvatarPhoto.UpdateFileSaved(auth.UserId);                
            }
            catch (Exception exc)
            {
                AddLog("SaveProfilePicture: " + exc.Message);                
            }
        }

        private string BuildToken(string userId, string secret)
        {
            try
            {
                var token = new
                {
                    Secret = secret,
                    UserId = userId
                };

                var tokenStr = JsonConvert.SerializeObject(token);
                var tokenJson = JObject.Parse(tokenStr);

                string encodedToken = JsonWebToken.Encode(tokenJson, GloobsterConfig.AppSecret, JwtHashAlgorithm.RS256);
                return encodedToken;
            }
            catch (Exception exc)
            {
                AddLog("BuildTokenError: " + exc.Message);
                throw;
            }
        }
    }
}