using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Serilog;
using TweetSharp;
using System.Linq;

namespace Gloobster.DomainModels.Services.Accounts
{
    public class TwitterSocLogin : ISocLogin
    {
        public ILogger Log { get; set; }

        public IGeoNamesService GNService { get; set; }

        public TwitterService TwitterSvc;
        public string ProfileUrl;

        public void Init(SocAuthDO auth)
        {
            TwitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
            TwitterSvc.AuthenticateWith(auth.AccessToken, auth.TokenSecret);
        }

        public TokenValidationResultDO ValidateToken(SocAuthDO auth)
        {
            TwitterSvc.AuthenticateWith(auth.AccessToken, auth.TokenSecret);

            TwitterUser user = TwitterSvc.VerifyCredentials(new VerifyCredentialsOptions());
            if (user == null)
            {
                return new TokenValidationResultDO
                {
                    IsValid = false
                };
            }

            return new TokenValidationResultDO
            {
                UserId = user.Id.ToString(),
                IsValid = true
            };                
        }
        
        public async Task<UserDO> GetUserData(SocAuthDO auth)
        {
            TwitterUser usr = TwitterSvc.VerifyCredentials(new VerifyCredentialsOptions { IncludeEntities = true });

            var user = new UserDO
            {
                Mail = null,
                HasProfileImage = false,
                UserId = auth.SocUserId,
                DisplayName = usr.ScreenName,
                FirstName = AccountUtils.TryExtractFirstName(usr.Name),
                LastName = AccountUtils.TryExtractLastName(usr.Name),
                Gender = Gender.N,
                HomeLocation = null,
                CurrentLocation = await ParseLocation(usr.Location),
                Languages = ParseLanguage(usr.Language)
            };

            ProfileUrl = GetImageUrl(usr.ProfileImageUrl);

            return user;
        }
        
        public PermanentTokenDO TryGetPermanentToken(string standardAccessToken)
        {
            return new PermanentTokenDO
            {
                Issued = false
            };
        }

        public string GetProfilePicUrl(SocAuthDO auth)
        {
            return ProfileUrl;
        }

        private string GetImageUrl(string roughUrl)
        {
            var url = roughUrl.Replace("_normal", "");
            return url;
        }

        private List<string> ParseLanguage(string language)
        {
            var result = new List<string>();

            if (!string.IsNullOrEmpty(language))
            {
                result.Add(language);
            }
            
            return result;
        }

        private async Task<CityLocationDO> ParseLocation(string query)
        {
            var results = await GNService.GetCityQueryAsync(query, 1);

            if (results.Any())
            {
                var result = results.First();
                
                var location = new CityLocationDO
                {
                    CountryCode = result.CountryCode,
                    City = result.Name,
                    GeoNamesId = result.GID
                };
                return location;
            }

            return null;
        }
    }
}

//places extractor
//todo: fix
//PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Twitter");

//var twitterAccount = portalUser.SocialAccounts.FirstOrDefault(a => a.NetworkType == SocialNetworkType.Twitter);
//if (twitterAccount == null)
//{
//	return;
//}

//await PlacesExtractor.ExtractNewAsync(portalUser.UserId, twitterAccount.Authentication);
//PlacesExtractor.SaveAsync();

//specifics
//var twitterAccount = new SocialAccountSE
//{
//    Authentication = Authentication.ToEntity(),
//    NetworkType = SocialNetworkType.Twitter,
//    Specifics = new TwitterUserSE
//    {
//        TimeZone = user.TimeZone,
//        ProfileImageUrl = user.ProfileImageUrl,
//        FollowersCount = user.FollowersCount,
//        ScreenName = user.ScreenName,
//        StatusesCount = user.StatusesCount,
//        FriendsCount = user.FriendsCount,
//        UtcOffset = user.UtcOffset,
//        Url = user.Url,
//        CreatedDate = user.CreatedDate
//    }
//};