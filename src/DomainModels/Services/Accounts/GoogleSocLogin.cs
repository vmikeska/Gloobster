using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Newtonsoft.Json;
using Serilog;

namespace Gloobster.DomainModels.Services.Accounts
{
    public class GoogleSocLogin : ISocLogin
    {
        public ILogger Log { get; set; }

        public string ProfileUrl;

        public void Init(SocAuthDO auth)
        {
            
        }

        public TokenValidationResultDO ValidateToken(SocAuthDO auth)
        {
            var url = "https://www.googleapis.com/oauth2/v1/tokeninfo";

            try
            {
                using (var client = new WebClient())
                {
                    var values = new NameValueCollection { ["access_token"] = auth.AccessToken };
                    byte[] response = client.UploadValues(url, values);
                    var resp = Encoding.Default.GetString(response);
                    var respObj = JsonConvert.DeserializeObject<GoogleAuthValidation>(resp);
                    
                    return new TokenValidationResultDO
                    {
                        UserId = respObj.user_id,
                        IsValid = true
                    };
                }
            }
            catch (Exception exc)
            {
                return new TokenValidationResultDO
                {
                    IsValid = false
                };
            }            
        }
        
        public async Task<UserDO> GetUserData(SocAuthDO auth)
        {
            var url = $"https://www.googleapis.com/plus/v1/people/me?access_token={auth.AccessToken}";

            try
            {
                using (var client = new WebClient())
                {
                    byte[] response = client.DownloadData(url);
                    var resp = Encoding.UTF8.GetString(response);
                    var respObj = JsonConvert.DeserializeObject<GoogleProfile>(resp);

                    var user = new UserDO
                    {                        
                        DisplayName = respObj.displayName,
                        Gender = ParseGender(respObj.gender),
                        Mail = "",
                        FirstName = "",
                        LastName = "",
                        Languages = ParseLanguages(respObj.language),                        
                        HasProfileImage = false,

                        //might be parsed, but has just citynames without country code
                        CurrentLocation = null,
                        HomeLocation = null
                    };
                    
                    if (respObj.name != null)
                    {
                        user.FirstName = respObj.name.givenName;
                        user.LastName = respObj.name.familyName;
                    }

                    if (respObj.emails.Any())
                    {
                        user.Mail = respObj.emails.First().value;
                    }

                    if (respObj.image != null)
                    {
                        ProfileUrl = respObj.image.url;
                    }

                    return user;
                }
            }
            catch (Exception exc)
            {
                Log.Error($"GetUserData-google: {exc.Message}, socUserId: {auth.SocUserId}");
                return null;
            }            
        }

        public PermanentTokenDO TryGetPermanentToken(string standardAccessToken)
        {
            return new PermanentTokenDO {Issued = false};
        }

        public string GetProfilePicUrl(SocAuthDO auth)
        {
            if (string.IsNullOrEmpty(ProfileUrl))
            {
                return null;
            }

            var prms = ProfileUrl.Split('?');
            
            return prms.FirstOrDefault();
        }
        
        private List<string> ParseLanguages(string langs)
        {
            return new List<string>
            {
                langs
            };
        }

        private Gender ParseGender(string gender)
        {
            if (gender.ToLower() == "male")
            {
                return Gender.M;
            }

            //todo: test female with female account
            if (gender.ToLower() == "female")
            {
                return Gender.F;
            }

            return Gender.N;
        }

        //DownloadPictureResult picResult = AccountUtils.DownloadPicture(User.ProfileLink);
        //AccountUtils.SaveProfilePicture(picResult.Data, picResult.ContentType, savedEntity.id.ToString(), FileDomain, DB);

        //ProfileLink = User.ProfileLink

        //      id = ObjectId.GenerateNewId(),
        //DisplayName = User.DisplayName,
        ////Mail = User.Mail,
        ////Password = AccountUtils.GeneratePassword(),
        ////ProfileImage = null,

        //FirstName = "",
        //LastName = "",
        //HomeLocation = null,
        //Gender = Gender.N,
        //Languages = null,
        //CurrentLocation = null


        //really update ?
        //private async void UpdateGoogleUserAuth(UserDO portalUser, string accessToken, DateTime expiresAt)
        //{
        //todo: fix
        //var portalUserEntity = portalUser.ToEntity();
        //var socialAccount = portalUserEntity.SocialAccounts.First(a => a.NetworkType == SocialNetworkType.Google);
        //socialAccount.Authentication.AccessToken = accessToken;
        //socialAccount.Authentication.ExpiresAt = expiresAt;

        //var result = await DB.ReplaceOneAsync(portalUserEntity);

        //if (result.MatchedCount == 0)
        //{
        //	//todo: make it nice here
        //	throw new Exception("something went wrong with update");
        //}
        //}
    }

    public class Email
    {
        public string value { get; set; }
        public string type { get; set; }
    }

    public class Url
    {
        public string value { get; set; }
        public string type { get; set; }
        public string label { get; set; }
    }

    public class Name
    {
        public string familyName { get; set; }
        public string givenName { get; set; }
    }

    public class Image
    {
        public string url { get; set; }
        public bool isDefault { get; set; }
    }

    public class PlacesLived
    {
        public string value { get; set; }
    }

    public class AgeRange
    {
        public int min { get; set; }
    }

    public class GoogleProfile
    {
        public string kind { get; set; }
        public string etag { get; set; }
        public string gender { get; set; }
        public List<Email> emails { get; set; }
        public List<Url> urls { get; set; }
        public string objectType { get; set; }
        public string id { get; set; }
        public string displayName { get; set; }
        public Name name { get; set; }
        public string url { get; set; }
        public Image image { get; set; }
        public List<PlacesLived> placesLived { get; set; }
        public bool isPlusUser { get; set; }
        public string language { get; set; }
        public AgeRange ageRange { get; set; }
        public int circledByCount { get; set; }
        public bool verified { get; set; }
    }


    public class GoogleAuthValidation
    {
        public string issued_to { get; set; }
        public string audience { get; set; }
        public string user_id { get; set; }
        public string scope { get; set; }
        public int expires_in { get; set; }
        public string email { get; set; }
        public bool verified_email { get; set; }
        public string access_type { get; set; }
    }
}