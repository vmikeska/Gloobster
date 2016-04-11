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
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
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
        public INotificationsDomain NotificationDomain { get; set; }
        public IAccountDomain AccountDomain { get; set; }

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
                        FullRegistration = accountExisting.EmailConfirmed
                    };
                    return response;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                //since here creating new account
                var userIdObj = new ObjectId(userId);
                var account = DB.FOD<AccountEntity>(a => a.User_id == userIdObj);

                bool accountHasAlreadyEmail = !string.IsNullOrEmpty(account.Mail);
                if (accountHasAlreadyEmail)
                {
                    return null;
                }

                if (!MailValid(mail))
                {
                    return null;
                }
                
                var filter = DB.F<AccountEntity>().Eq(u => u.id, account.id);
                var u1 = DB.U<AccountEntity>().Set(u => u.Mail, mail);
                var u2 = DB.U<AccountEntity>().Set(u => u.Password, password);
                await DB.UpdateAsync(filter, u1);
                await DB.UpdateAsync(filter, u2);

                var newUserEntity = new UserEntity
                {
                    id = ObjectId.GenerateNewId(),
                    DisplayName = GetNameFromEmail(mail),
                    Gender = Gender.N,
                    Languages = new List<string>(),
                    CurrentLocation = null,
                    Mail = mail,
                    FirstName = "",
                    LastName = "",
                    User_id = userIdObj,
                    HomeAirports = new List<AirportSaveSE>(),
                    HomeLocation = null,
                    HasProfileImage = false
                };
                await DB.SaveAsync(newUserEntity);

                await CreateNewUserData(userId, newUserEntity.DisplayName);

                var response = new LoginResponseDO
                {
                    Token = BuildToken(account.User_id.ToString(), account.Secret),
                    UserId = userId,
                    DisplayName = newUserEntity.DisplayName,
                    NetType = SocialNetworkType.Base,
                    SocToken = null,
                    FullRegistration = false
                };
                return response;
            }            
        }

        public async Task<LoginResponseDO> HandleAsync(SocAuthDO auth)
        {
            LoginResponseDO res = null;

            SocLogin.Init(auth);

            var tokenResult = SocLogin.ValidateToken(auth);
            bool isTokenValid = tokenResult.IsValid && (auth.SocUserId == tokenResult.UserId);
            Log.Debug("TokenValid: " + isTokenValid);
            if (!isTokenValid)
            {
                return null;
            }

            var socAccount1 = DB.FOD<SocialAccountEntity>(a => a.UserId == auth.SocUserId && a.NetworkType == auth.NetType);
            bool socAccountExists = socAccount1 != null;
            Log.Debug("socAccountExists: " + socAccountExists);
            if (socAccountExists)
            {
                res = await SocAccountExists(auth, socAccount1);
                if (auth.UserId != res.UserId)
                {
                    //here could be delete temp account
                }
                return res;
            }

            using (await _mutex.LockAsync())
            {
                var socAccount = DB.FOD<SocialAccountEntity>(a => a.UserId == auth.SocUserId && a.NetworkType == auth.NetType);

                bool socAccountNew = socAccount == null;
                if (socAccountNew)
                {
                    Log.Debug("Creating new account");
                    res = await SocAccountNew(auth);                    
                    return res;
                }
            }

            return null;
        }

        //private Task DeleteAccountIfEmpty(string userId)
        //{
        //    var userIdObj = new ObjectId(userId);

        //    var user = DB.FOD<UserEntity>(a => a.User_id == userIdObj);
        //    var trips = DB.FOD<TripEntity>(a => a.User_id == userIdObj);
        //    var visited = DB.FOD<Visited>(a => a.User_id == userIdObj);
        //}

        private async Task CreateNewUserData(string userId, string displayName)
        {
            var userIdObj = new ObjectId(userId);

            var notifications = new Notifications();
            var notification = notifications.NewAccountNotification(userId);
            NotificationDomain.AddNotification(notification);

            var friendsEntity = new FriendsEntity
            {
                id = new ObjectId(),
                User_id = userIdObj,
                Friends = new List<ObjectId>(),
                AwaitingConfirmation = new List<ObjectId>(),
                Blocked = new List<ObjectId>(),
                Proposed = new List<ObjectId>()
            };
            await DB.SaveAsync(friendsEntity);
        }

        private string GetNameFromEmail(string mail)
        {
            var prms = mail.Split('@');
            return prms[0];
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
            var userIdObj = new ObjectId(auth.UserId);

            var accountEntity = DB.FOD<AccountEntity>(u => u.User_id == userIdObj);

            var newSocAccount = await CreateNewSocialAccount(auth);

            var userEntity = await CreateUserEntityIfNotExistsYet(auth, newSocAccount);

            await CreateNewUserData(auth.UserId, userEntity.DisplayName);

            await SocLogin.OnNewUser(auth);

            var response = new LoginResponseDO
            {
                Token = BuildToken(auth.UserId, accountEntity.Secret),
                UserId = auth.UserId,
                DisplayName = userEntity.DisplayName,
                NetType = auth.NetType,
                SocToken = auth.AccessToken,
                FullRegistration = IsFullRegistration(auth.UserId)
            };
            
            return response;
        }
        
        private async Task<SocialAccountEntity> CreateNewSocialAccount(SocAuthDO auth)
        {
            var userIdObj = new ObjectId(auth.UserId);

            var permanentToken = SocLogin.TryGetPermanentToken(auth.AccessToken);

            var newSocAccount = new SocialAccountEntity
            {
                id = ObjectId.GenerateNewId(),
                UserId = auth.SocUserId,
                ExpiresAt = auth.ExpiresAt,
                User_id = userIdObj,
                TokenSecret = auth.TokenSecret,
                NetworkType = auth.NetType
            };

            if (permanentToken.Issued)
            {
                newSocAccount.AccessToken = permanentToken.PermanentAccessToken;
                newSocAccount.HasPermanentToken = true;
            }
            else
            {
                newSocAccount.AccessToken = auth.AccessToken;
                newSocAccount.HasPermanentToken = false;
                newSocAccount.ErrorMessage = permanentToken.Message;
            }

            await DB.SaveAsync(newSocAccount);

            return newSocAccount;
        }

        private async Task<UserEntity> CreateUserEntityIfNotExistsYet(SocAuthDO auth, SocialAccountEntity newSocAccount)
        {
            //maybe in future it can fill in other params from other networks, if they were not filled-in before
            var userIdObj = new ObjectId(auth.UserId);
            
            var userEntity = DB.FOD<UserEntity>(u => u.User_id == userIdObj);
            var userData = await SocLogin.GetUserData(auth);
            bool userEntityExists = userEntity != null;
            if (!userEntityExists)
            {                
                if (userData != null)
                {
                    userEntity = new UserEntity
                    {
                        id = ObjectId.GenerateNewId(),
                        DisplayName = userData.DisplayName,
                        Gender = userData.Gender,
                        CurrentLocation = userData.CurrentLocation.ToEntity(),
                        FirstName = userData.FirstName,
                        LastName = userData.LastName,
                        HomeLocation = userData.HomeLocation.ToEntity(),
                        User_id = userIdObj,
                        Languages = userData.Languages,
                        HomeAirports = new List<AirportSaveSE>(),
                        HasProfileImage = false,
                        Mail = userData.Mail
                    };

                    await DB.SaveAsync(userEntity);

                    var profilePicUrl = SocLogin.GetProfilePicUrl(auth);
                    SaveProfilePicture(profilePicUrl, newSocAccount.User_id.ToString());
                }                
            }
            
            if (string.IsNullOrEmpty(userEntity.Mail) && !string.IsNullOrEmpty(userData.Mail))
            {
                //update email for mail communication
                await UpdateCommunicationAccount(userEntity.id, userData.Mail);                                
            }

            var account = DB.FOD<AccountEntity>(a => a.User_id == userIdObj);
            if (string.IsNullOrEmpty(account.Mail) && !string.IsNullOrEmpty(userData.Mail))
            {                                
                await UpdateAccountEmail(userIdObj, userData.Mail);                
            }
            
            return userEntity;
        }

        private async Task UpdateAccountEmail(ObjectId userIdObj, string mail)
        {
            var account = DB.FOD<AccountEntity>(a => a.User_id == userIdObj);
            if (string.IsNullOrEmpty(account.Mail))
            {
                var newPass = System.Web.Security.Membership.GeneratePassword(6, 2);

                var filter = DB.F<AccountEntity>().Eq(u => u.User_id, userIdObj);
                var u1 = DB.U<AccountEntity>().Set(u => u.Mail, mail);
                var u2 = DB.U<AccountEntity>().Set(u => u.Password, newPass);

                await DB.UpdateAsync(filter, u1);
                await DB.UpdateAsync(filter, u2);
            }
        }

        private async Task UpdateCommunicationAccount(ObjectId userEntityId, string mail)
        {
            var filter = DB.F<UserEntity>().Eq(u => u.id, userEntityId);
            var update = DB.U<UserEntity>().Set(u => u.Mail, mail);
            await DB.UpdateAsync(filter, update);
        }

        private async Task<LoginResponseDO> SocAccountExists(SocAuthDO auth, SocialAccountEntity socAccount)
        {
            //todo:check if old account is empty - delete
            //check it's not the same :)

            await RenewTokenIfPossible(auth, socAccount.id);

            var accountBySocAccount = DB.FOD<AccountEntity>(u => u.User_id == socAccount.User_id);

            var user = DB.FOD<UserEntity>(u => u.User_id == socAccount.User_id);

            var response = new LoginResponseDO
            {
                Token = BuildToken(accountBySocAccount.User_id.ToString(), accountBySocAccount.Secret),
                UserId = auth.UserId,
                DisplayName = user.DisplayName,
                NetType = auth.NetType,
                SocToken = auth.AccessToken,
                FullRegistration = IsFullRegistration(accountBySocAccount.User_id.ToString())
            };
            return response;
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

        public void SaveProfilePicture(string url, string userId)
        {
            try
            {
                var location = FileDomain.Storage.Combine(AvatarFilesConsts.Location, userId);

                AvatarPhoto.DeleteOld(location);

                var client = new WebClient();
                var bytes = client.DownloadData(url);
                var bytesStream = new MemoryStream(bytes);
                
                AvatarPhoto.CreateThumbnails(location, bytesStream);
                AvatarPhoto.UpdateFileSaved(userId);                
            }
            catch (Exception exc)
            {
                Log.Error("SaveProfilePicture: " + exc.Message);                
            }
        }

        private string BuildToken(string userId, string secret)
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
    }
}