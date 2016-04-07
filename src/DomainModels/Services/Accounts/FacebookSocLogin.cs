using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.DomainModels.Services.Accounts
{
    public class FacebookSocLogin : ISocLogin
    {
        public ILogger Log { get; set; }

        public IDbOperations DB { get; set; }
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

        public void Init(SocAuthDO auth)
        {
            
        }

        public TokenValidationResultDO ValidateToken(SocAuthDO auth)
        {
            FBService.SetAccessToken(auth.AccessToken);
            string id = FBService.GetMeId();
            if (string.IsNullOrEmpty(id))
            {
                return new TokenValidationResultDO
                {
                    IsValid = false
                };
            }
            
            return new TokenValidationResultDO
            {
                UserId = id,
                IsValid = true
            };            
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
        }

        public string GetProfilePicUrl(SocAuthDO auth)
        {
            var profileLink = $"http://graph.facebook.com/{auth.SocUserId}/picture?type=large";
            return profileLink;
        }

        public async Task OnNewUser(SocAuthDO auth)
        {
            await CreateMasterAdminPermissions(auth);
        }

        private async Task CreateMasterAdminPermissions(SocAuthDO auth)
        {
            if (auth.SocUserId == "10202803343824427")
            {
                var masterAdmin = new WikiPermissionEntity
                {
                    IsMasterAdmin = true,
                    IsSuperAdmin = false,
                    id = ObjectId.GenerateNewId(),
                    User_id = new ObjectId(auth.UserId),
                    Articles = new List<ObjectId>()
                };
                await DB.SaveAsync(masterAdmin);
            }            
        }

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

        //specifics
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
}