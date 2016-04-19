using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.DomainModels.Services.Accounts
{
    public class NewAccountCreator: INewAccountCreator
    {
        public ILogger Log { get; set; }

        public IDbOperations DB { get; set; }        
        public INotificationsDomain NotificationDomain { get; set; }
        public INotifications Notifications { get; set; }

        public IFilesDomain FileDomain { get; set; }
        public IAvatarPhoto AvatarPhoto { get; set; }

        public ISocLogin SocLogin { get; set; }

        public FriendsEntity NewFriendsEntity;
        public UserEntity NewUserEntity;
        public SocialAccountEntity NewSocAccountEntity;

        private void AddLog(string log)
        {
            Log.Debug($"SocNetworkService: {log}");
        }

        private string UserId;

        public async Task<bool> CreateUserFromSocNet(string userId, SocAuthDO auth)
        {
            try
            {
                UserId = userId;
                var userIdObj = new ObjectId(userId);

                bool socAccCreated = await CreateNewSocialAccountEntity(auth);
                if (!socAccCreated)
                {
                    return false;
                }

                UserDO userData = await GetUserDataFromSocNet(auth);
                bool userDataCreated = await CreateUserData(userId, userData);
                if (!userDataCreated)
                {
                    return false;
                }

                bool emailUpdate = await UpdateAccountEmailIfNeededOrPossible(userIdObj, userData.Mail);
                if (!emailUpdate)
                {                    
                    return false;
                }

                return true;
            }
            catch (Exception exc)
            {
                await RollBack();
                AddLog($"CreateUserDataFromMail: exception: {exc.Message}");
                return false;
            }
        }

        public async Task<bool> CreateUserFromMail(string userId, string mail, string password)
        {
            try
            {
                UserId = userId;

                var userIdObj = new ObjectId(userId);

                var userData = GetEmptyUserData(userId);
                userData.Mail = mail;
                userData.DisplayName = GetNameFromEmail(mail);

                bool userDataCreated = await CreateUserData(userId, userData);
                if (!userDataCreated)
                {
                    return false;
                }

                var filter = DB.F<AccountEntity>().Eq(u => u.User_id, userIdObj);
                var u1 = DB.U<AccountEntity>().Set(u => u.Mail, mail);
                var u2 = DB.U<AccountEntity>().Set(u => u.Password, password);
                await DB.UpdateAsync(filter, u1);
                await DB.UpdateAsync(filter, u2);

                return true;
            }
            catch (Exception exc)
            {
                await RollBack();
                AddLog($"CreateUserDataFromMail: exception: {exc.Message}");
                return false;
            }
        }

        private async Task<bool> CreateUserData(string userId, UserDO userData)
        {
            var userIdObj = new ObjectId(userId);

            bool user = await CreateUserEntity(userData, userIdObj);
            if (!user)
            {                
                return false;
            }

            bool friends = await CreateFriendsEntity(userId);
            if (!friends)
            {             
                return false;
            }

            bool notifs = CreateNotifications(userId);
            if (!notifs)
            {             
                return false;
            }
            
            return true;                      
        }
        
        private string GetNameFromEmail(string mail)
        {
            var prms = mail.Split('@');
            return prms[0];
        }

        public async Task RollBack()
        {
            var userIdObj = new ObjectId(UserId);

            await DB.DeleteAsync<UserEntity>(u => u.User_id == userIdObj);
            await DB.DeleteAsync<FriendsEntity>(u => u.User_id == userIdObj);

            await DB.DeleteAsync<NotificationsEntity>(u => u.User_id == userIdObj);

            if (NewSocAccountEntity != null)
            {
                await DB.DeleteAsync<SocialAccountEntity>(u => u.id == NewSocAccountEntity.id);
            }
        }

        private async Task<UserDO> GetUserDataFromSocNet(SocAuthDO auth)
        {
            try
            {
                UserDO userData = await SocLogin.GetUserData(auth);
                return userData;
            }
            catch (Exception exc)
            {
                AddLog($"GetUserData: for: {auth.NetType.ToString()}, exception: " + exc.Message);

                return GetEmptyUserData(auth.UserId);
            }
        }

        private UserDO GetEmptyUserData(string userId)
        {
            var empty = new UserDO
            {
                CurrentLocation = null,
                DefaultLang = "en",
                DisplayName = "No name",
                FirstName = "NoName",
                LastName = "NoName",
                Gender = Gender.N,
                HasProfileImage = false,
                HomeLocation = null,
                Languages = new List<string>(),
                Mail = "",
                UserId = userId
            };
            return empty;
        }

        private async Task<bool> CreateUserEntity(UserDO userData, ObjectId userIdObj)
        {
            try
            {   
                NewUserEntity = new UserEntity
                {
                    id = ObjectId.GenerateNewId(),

                    DisplayName = userData.DisplayName,
                    Gender = userData.Gender,
                    FirstName = userData.FirstName,
                    LastName = userData.LastName,
                    User_id = userIdObj,
                    Languages = userData.Languages,
                    Mail = userData.Mail,

                    DefaultLang = "en",
                    HomeAirports = new List<AirportSaveSE>(),
                    HasProfileImage = false
                };

                if (userData.CurrentLocation != null)
                {
                    NewUserEntity.CurrentLocation = userData.CurrentLocation.ToEntity();
                }

                if (userData.HomeLocation != null)
                {
                    NewUserEntity.HomeLocation = userData.HomeLocation.ToEntity();
                }


                AddLog($"saving new entity");
                await DB.SaveAsync(NewUserEntity);

                return true;
            }
            catch (Exception exc)
            {
                AddLog($"CreateUserEntity: exception: {exc.Message}");
                return false;
            }
        }

        private async Task<bool> CreateNewSocialAccountEntity(SocAuthDO auth)
        {
            try
            {
                var userIdObj = new ObjectId(auth.UserId);

                var permanentToken = SocLogin.TryGetPermanentToken(auth.AccessToken);

                NewSocAccountEntity = new SocialAccountEntity
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
                    NewSocAccountEntity.AccessToken = permanentToken.PermanentAccessToken;
                    NewSocAccountEntity.HasPermanentToken = true;
                }
                else
                {
                    NewSocAccountEntity.AccessToken = auth.AccessToken;
                    NewSocAccountEntity.HasPermanentToken = false;
                    NewSocAccountEntity.ErrorMessage = permanentToken.Message;
                }

                await DB.SaveAsync(NewSocAccountEntity);

                return true;
            }
            catch (Exception exc)
            {
                AddLog($"CreateNewSocialAccount: exception : {exc.Message}");
                return false;
            }
        }

        private async Task<bool> UpdateAccountEmailIfNeededOrPossible(ObjectId userIdObj, string mail)
        {
            try
            {
                var account = DB.FOD<AccountEntity>(a => a.User_id == userIdObj);

                if (!string.IsNullOrEmpty(account.Mail))
                {
                    return true;
                }
                
                if (string.IsNullOrEmpty(mail))
                {
                    return true;
                }
                
                var newPass = System.Web.Security.Membership.GeneratePassword(6, 2);

                var filter = DB.F<AccountEntity>().Eq(u => u.User_id, userIdObj);
                var u1 = DB.U<AccountEntity>().Set(u => u.Mail, mail);
                var u2 = DB.U<AccountEntity>().Set(u => u.Password, newPass);

                await DB.UpdateAsync(filter, u1);
                await DB.UpdateAsync(filter, u2);
                return true;
            }
            catch (Exception exc)
            {
                AddLog($"UpdateAccountEmailIfNeededOrPossible: exception: {exc.Message}");
                return false;
            }
        }
        
        public async Task<bool> CreateFriendsEntity(string userId)
        {
            try
            {
                var userIdObj = new ObjectId(userId);

                NewFriendsEntity = new FriendsEntity
                {
                    id = ObjectId.GenerateNewId(),
                    User_id = userIdObj,
                    Friends = new List<ObjectId>(),
                    AwaitingConfirmation = new List<ObjectId>(),
                    Blocked = new List<ObjectId>(),
                    Proposed = new List<ObjectId>()
                };
                await DB.SaveAsync(NewFriendsEntity);
                
                return true;
            }
            catch (Exception exc)
            {
                AddLog($"CreateFriendsEntity: {exc.Message}");
                return false;
            }
        }
        
        public bool CreateNotifications(string userId)
        {
            try
            {
                var notification = Notifications.NewAccountNotification(userId);
                NotificationDomain.AddNotification(notification);
                return true;
            }
            catch (Exception exc)
            {
                AddLog($"CreateNotificationsEntity: {exc.Message}");
                return false;
            }
        }
    }
}