using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.CommonEnums;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModels.Services.Places;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using MongoDB.Bson;
using MongoDB.Driver;
using TweetSharp;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class TwitterAccountDriver : IAccountDriver
	{
		public SocialNetworkType NetworkType => SocialNetworkType.Twitter;

		public SocAuthenticationDO Authentication { get; set; }
		public object UserObj { get; set; }

		public IComponentContext ComponentContext { get; set; }
		public IDbOperations DB { get; set; }
		public PortalUserDO PortalUser { get; set; }
		public TwitterService TwitterSvc { get; set; }
		public IGeoNamesService GNService { get; set; }
		
		public IPlacesExtractor PlacesExtractor { get; set; }

		public TwitterAccountDriver()
		{
			TwitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
		}



		public async Task<PortalUserDO> Create()
		{
			TwitterSvc.AuthenticateWith(Authentication.AccessToken, Authentication.TokenSecret);

			TwitterUser user = TwitterSvc.VerifyCredentials(new VerifyCredentialsOptions { IncludeEntities = true });
			
			//todo: make additional step to provide email
			var email = "twitter";

			var twitterAccount = new SocialAccountSE
			{
				Authentication = Authentication.ToEntity(),
				NetworkType = SocialNetworkType.Twitter,
				Specifics = new TwitterUserSE
				{
					TimeZone = user.TimeZone,
					ProfileImageUrl = user.ProfileImageUrl,
					FollowersCount = user.FollowersCount,
					ScreenName = user.ScreenName,
					StatusesCount = user.StatusesCount,
					FriendsCount = user.FriendsCount,
					UtcOffset = user.UtcOffset,
					Url = user.Url,
					CreatedDate = user.CreatedDate					
				}
			};


			var userEntity = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = user.ScreenName,
				Mail = email,
				Password = AccountUtils.GeneratePassword(),				
				Languages = ParseLanguage(user.Language),
				CurrentLocation = await ParseLocation(user.Location),
				ProfileImage = AccountUtils.DownloadAndStoreTheProfilePicture(user.ProfileImageUrl),				
				FirstName = AccountUtils.TryExtractFirstName(user.Name),
				LastName = AccountUtils.TryExtractLastName(user.Name),
				
				Gender = Gender.N,
				HomeLocation = null,

				SocialAccounts = new [] {twitterAccount}
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			var createdUser = savedEntity.ToDO();
			return createdUser;
		}

		private async Task<CityLocationSE> ParseLocation(string query)
		{
			CitySearchResponse results = await GNService.GetCityQueryAsync(query, 1);

			if (results.GeoNames.Any())
			{
				var result = results.GeoNames.First();

				//todo: check on it
				var location = new CityLocationSE
				{
					CountryCode = result.FCode,
					City = result.Name,
					GeoNamesId = result.GeonameId
				};
				return location;				
			}
			
			return null;
		}

		private LanguageSE[] ParseLanguage(string language)
		{
			//todo: implement
			var result = new List<LanguageSE>();
			
			if (language == "en")
			{
				result.Add(new LanguageSE { LanguageId = 0, Name = "English" });				
			}

			return result.ToArray();
		}

		public static FilterDefinition<BsonDocument> GetFilterForSocNetwork(SocialNetworkType networkType, string socNetworkUserId)
		{
			FilterDefinitionBuilder<BsonDocument> builder = Builders<BsonDocument>.Filter;
			FilterDefinition<BsonDocument> filter = 
				builder.Eq("UserId", socNetworkUserId) & 
				builder.Eq("SocialAccounts.NetworkType", networkType.ToString());
			return filter;
		}
		

		public string GetEmail()
		{
			return "unique";
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			
		}

		public async void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
			PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Twitter");

			var twitterAccount = portalUser.SocialAccounts.FirstOrDefault(a => a.NetworkType == SocialNetworkType.Twitter);
			if (twitterAccount == null)
			{
				return;
			}

			await PlacesExtractor.ExtractNewAsync(portalUser.UserId, twitterAccount.Authentication);
			PlacesExtractor.SaveAsync();
		}
	}
}