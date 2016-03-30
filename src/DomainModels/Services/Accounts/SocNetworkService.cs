using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;
using System.Linq;
using System.Net;
using Gloobster.DomainModels.Wiki;
using Gloobster.Entities.Trip;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.Services.Accounts
{
    
    public class SocNetworkService : ISocNetworkService
    {
        public ILogger Log { get; set; }

        public IDbOperations DB { get; set; }
        public ISocLogin SocLogin { get; set; }
        public IFilesDomain FileDomain { get; set; }
        public IAvatarPhoto AvatarPhoto { get; set; }

        public async Task<LoginResponseDO> HandleAsync(SocAuthDO auth)
        {
            bool accessTokenValid = SocLogin.ValidateToken(auth.AccessToken);
            if (!accessTokenValid)
            {
                //return HttpUnauthorized();
                return null;
            }

            var userIdObj = new ObjectId(auth.UserId);

            var socAccount = DB.FOD<SocialAccountEntity>(a =>
                a.UserId == auth.SocUserId
                && a.NetworkType == auth.NetType);
            
            bool socAccountExists = socAccount != null;
            if (socAccountExists)
            {
                //todo:check if old account is empty - delete
                //check it's not the same :)

                var accountBySocAccount = DB.FOD<AccountEntity>(u => u.User_id == socAccount.User_id);
                
                var response = new LoginResponseDO
                {
                    Token = BuildToken(accountBySocAccount.User_id.ToString(), accountBySocAccount.Secret),
                    UserId = auth.UserId,
                    DisplayName = "TODO"
                };
                return response;
            }
            else
            {
                var accountEntity = DB.FOD<AccountEntity>(u => u.User_id == userIdObj);

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

                var userEntityExisting = DB.FOD<UserEntity>(u => u.User_id == userIdObj);
                bool userEntityExists = userEntityExisting != null;
                if (!userEntityExists)
                {
                    var userData = await SocLogin.GetUserData(auth);
                    var userEntity = new UserEntity
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
                        HasProfileImage = false
                    };

                    await DB.SaveAsync(userEntity);
                }


                var profilePicUrl = SocLogin.GetProfilePicUrl(auth);
                SaveProfilePicture(profilePicUrl, newSocAccount.UserId);

                //todo: update email if none + generate password

                var response = new LoginResponseDO
                {
                    Token = BuildToken(auth.UserId, accountEntity.Secret),
                    UserId = auth.UserId,
                    DisplayName = "TODO"
                };
                return response;
            }


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

    public class FacebookSocLogin : ISocLogin
    {
        public ILogger Log { get; set; }

        public IFacebookService FBService { get; set; }
        public ICountryService CountryService { get; set; }
        public IGeoNamesService GNService { get; set; }

        private FacebookUserFO _fbUser;
        
        private FacebookUserFO GetFbUser(string accessToken)
        {
            if (_fbUser == null)
            {
                FBService.SetAccessToken(accessToken);
                _fbUser = FBService.Get<FacebookUserFO>("/me");
            }
                 
            return _fbUser;            
        }

        public bool ValidateToken(string token)
        {
            FBService.SetAccessToken(token);
            bool tokenValid = FBService.ValidateToken();

            return tokenValid;
        }

        public async Task<UserDO> GetUserData(SocAuthDO auth)
        {
            var fbUser = GetFbUser(auth.AccessToken);

            var userDO = new UserDO
            {
                DisplayName = fbUser.Name,
                Mail = fbUser.Email,

                Gender = ParseGender(fbUser.Gender),
                FirstName = fbUser.FirstName,
                LastName = fbUser.LastName,
                Languages = ParseLanguages(fbUser.Languages),
                CurrentLocation = await ParseLocationAsync(fbUser.Location),
                HomeLocation = await ParseLocationAsync(fbUser.HomeTown)
            };
            
            return userDO;

            //do not delete until decision with specific data will be made
            //var specifics = new FacebookUserSE
            //{
            //    TimeZone = _fbUser.TimeZone,
            //    Link = FbUser.Link,
            //    Locale = FbUser.Locale,
            //    UpdatedTime = FbUser.UpdatedTime,
            //    Verified = FbUser.Verified
            //};

            //if (_fbUser.FavoriteTeams != null)
            //{
            //    specifics.FavoriteTeams = _fbUser.FavoriteTeams.Select(i => i.ToEntity()).ToArray();
            //}
        }


        public string GetProfilePicUrl(SocAuthDO auth)
        {
            var profileLink = $"http://graph.facebook.com/{auth.SocUserId}/picture?type=large";
            return profileLink;
        }

        
        //delete when new code tested
        //DownloadPictureResult picResult = AccountUtils.DownloadPicture(profileLink);
        //AccountUtils.SaveProfilePicture(picResult.Data, picResult.ContentType, savedEntity.id.ToString(), FileDomain, DB);    
        

        public PermanentTokenDO TryGetPermanentToken(string standardAccessToken)
        {
            var res = new PermanentTokenDO
            {
                AccessToken = standardAccessToken,
                Issued = true
            };

            try
            {
                int expireToleranceInSeconds = 60;

                var url =
                    $"/oauth/access_token?grant_type=fb_exchange_token&client_id={GloobsterConfig.FacebookAppId}&client_secret={GloobsterConfig.FacebookAppSecret}&fb_exchange_token={standardAccessToken}";

                FBService.SetAccessToken(standardAccessToken);
                var permanentToken = FBService.Get<FacebookPermanentToken>(url);

                var newExpireTime = DateTime.UtcNow.AddSeconds(permanentToken.SecondsToExpire - expireToleranceInSeconds);

                res.PermanentAccessToken = permanentToken.AccessToken;
                res.NewExpireAt = newExpireTime;                
            }
            catch (Exception exc)
            {
                Log.Error("IssueNewPermanentAccessToken: Problems while issuing permanent token from : " + standardAccessToken);

                res.Issued = false;
                res.Message = exc.Message;
            }

            return res;
        }
        
        //dont delete yet
        //public async void UpdateFacebookUserAuth(UserDO portalUser, string accessToken, DateTime expiresAt)
        //{
        //    var portalUserEntity = portalUser.ToEntity();
        //    var socialAccount = portalUserEntity.SocialAccounts.First(a => a.NetworkType == SocialNetworkType.Facebook);
        //    socialAccount.Authentication.AccessToken = accessToken;
        //    socialAccount.Authentication.ExpiresAt = expiresAt;

        //    var result = await DB.ReplaceOneAsync(portalUserEntity);

        //    if (result.MatchedCount == 0)
        //    {
        //        //todo: make it nice here
        //        throw new Exception("something went wrong with update");
        //    }
        //}



        private async Task<CityLocationDO> ParseLocationAsync(IdNameFO location)
        {
            if (location == null)
            {
                return null;
            }

            var prms = location.Name.Split(',');
            bool isValid = prms.Count() == 2;
            if (!isValid)
            {
                return null;
            }
            var cityName = prms[0].Trim();
            var countryName = prms[1].Trim();
            var country = CountryService.GetByCountryName(countryName);
            if (country == null)
            {
                return null;
            }

            var gnResult = await GNService.GetCityAsync(cityName, country.CountryCode, 1);
            if (gnResult.Count != 1)
            {
                return null;
            }

            var gnCity = gnResult.First();
            var resultLoc = new CityLocationDO
            {
                CountryCode = country.CountryCode,
                City = cityName,
                GeoNamesId = gnCity.GID                
            };

            return resultLoc;
        }

        private Gender ParseGender(string gender)
        {
            if (gender.ToLower() == "male")
            {
                return Gender.M;
            }

            if (gender.ToLower() == "female")
            {
                return Gender.F;
            }

            return Gender.N;
        }

        private List<string> ParseLanguages(IdNameFO[] languages)
        {
            if (languages == null)
            {
                return new List<string>();
            }
            
            var langs = languages.Select(l => l.Name).ToList();
            return langs;
        }

        //don't delete until you find the token issuing working
        //private void UpdateTokenIfNeeded(UserDO portalUser)
        //{
        //    try
        //    {
        //        var account = portalUser.SocialAccounts.FirstOrDefault(a => a.NetworkType == SocialNetworkType.Facebook);
        //        if (account == null)
        //        {
        //            return;
        //        }

        //        //TODO: possibly should update all the time ?
        //        bool expired = account.Authentication.ExpiresAt < DateTime.UtcNow;
        //        Log.Debug("UpdateTokenIfNeeded: Session expired: " + expired);
        //        if (expired)
        //        {
        //            var newPermanentToken = IssueNewPermanentAccessToken(account.Authentication.AccessToken);
        //            UpdateFacebookUserAuth(portalUser, newPermanentToken.AccessToken, newPermanentToken.ExpiresAt);
        //        }
        //    }
        //    catch (Exception exc)
        //    {
        //        Log.Error("UpdateTokenIfNeeded: " + exc.Message);
        //    }
        //}
    }
}