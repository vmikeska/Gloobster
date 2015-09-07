using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Facebook;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;

namespace Gloobster.DomainModels
{
	[DataContract]
	public class FacebookPermanentToken
	{
		[DataMember(Name = "access_token")]
		public string AccessToken { get; set; }
		[DataMember(Name = "expires")]
		public int SecondsToExpire { get; set; }
	}

	public class FacebookUserDomain : IFacebookUserDomain
	{
		public IDbOperations DB;
		public IFacebookService FBService;
		public IFacebookTaggedPlacesExtractor TaggedPlacesExtractor;
		public IVisitedPlacesDomain VisitedPlacesDomain;
		public IVisitedCountriesDomain VisitedCountries;

		public FacebookUserDomain(IDbOperations db, IFacebookService fbService, IFacebookTaggedPlacesExtractor taggedPlacesExtractor, IVisitedPlacesDomain visitedPlacesDomain,
			IVisitedCountriesDomain visitedCountriesDomain)
		{
			DB = db;
			FBService = fbService;
			TaggedPlacesExtractor = taggedPlacesExtractor;
			VisitedPlacesDomain = visitedPlacesDomain;
			VisitedCountries = visitedCountriesDomain;
		}

		

		public bool LogInFacebookUser(FacebookUserAuthenticationDO facebookUser)
		{
			return true;
		}

		public async Task<FacebookUserExistsDO> FacebookUserExists(string userId)
		{
			var query = $"{{ 'Facebook.FacebookUser.UserId': '{userId}' }}";
			var results = await DB.FindAsync<PortalUserEntity>(query);

			bool exist = (results != null && results.Any());

			var result = new FacebookUserExistsDO
			{
				UserExists = exist
			};

			if (exist)
			{
				result.PortalUser = results.First().ToDO();
			}

			return result;
		}



		public async Task<CreateFacebookUserResultDO> CreateFacebookUser(FacebookUserAuthenticationDO fbUserAuthentication)
		{
			var fbUserExists = await FacebookUserExists(fbUserAuthentication.UserId);
			if (fbUserExists.UserExists)
			{
				return new CreateFacebookUserResultDO {Status = UserCreated.UserExists};
			}

			//todo: check if email exists in the system already

			var permenentToken = IssueNewPermanentAccessToken(fbUserAuthentication.AccessToken);
			
			FBService.SetAccessToken(fbUserAuthentication.AccessToken);
			var userCallResult = FBService.Get<FacebookUserFO>("/me");
			var resultEntity = userCallResult.ToEntity();
			
			var userEntity = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = resultEntity.Name,
				Mail = resultEntity.Email,
				Password = GeneratePassword(),
				Facebook = new FacebookGroupEntity
				{
					Authentication = new FacebookUserAuthenticationEntity
					{
						AccessToken = permenentToken.AccessToken,
						ExpiresAt = permenentToken.ExpiresAt,
						UserId = fbUserAuthentication.UserId
					},
					FacebookUser = resultEntity
				}
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			return new CreateFacebookUserResultDO {Status = UserCreated.Successful, CreatedUser = savedEntity.ToDO()};
		}

		private FacebookUserAuthenticationDO IssueNewPermanentAccessToken(string accessToken)
		{
			int expireToleranceInSeconds = 60;

			var url =
				string.Format("/oauth/access_token?grant_type=fb_exchange_token&client_id={0}&client_secret={1}&fb_exchange_token={2}",
					GloobsterConfig.FacebookAppId, GloobsterConfig.FacebookAppSecret, accessToken);

			FBService.SetAccessToken(accessToken);
			var permanentToken = FBService.Get<FacebookPermanentToken>(url);

			var newExpireTime = DateTime.UtcNow.AddSeconds(permanentToken.SecondsToExpire - expireToleranceInSeconds);

			var result = new FacebookUserAuthenticationDO
			{
				AccessToken = permanentToken.AccessToken,
				ExpiresAt = newExpireTime
			};

			return result;
		}

		public async Task<UserLoggedResultDO> ValidateFacebookUser(FacebookUserAuthenticationDO fbAuth)
		{
			var result = new UserLoggedResultDO {IsFacebook = true, IsStandardUser = false, RegisteredNewUser = false};

			string dbUserId;

			var fbExistResult = await FacebookUserExists(fbAuth.UserId);

			if (!fbExistResult.UserExists)
			{
				var newUser = await CreateFacebookUser(fbAuth);
				dbUserId = newUser.CreatedUser.DbUserId;
				result.RegisteredNewUser = true;				
			}
			else
			{
				dbUserId = fbExistResult.PortalUser.DbUserId;
				
				bool expired = fbExistResult.PortalUser.Facebook.Authentication.ExpiresAt < DateTime.UtcNow;
				if (expired)
				{
					var newPermanentToken = IssueNewPermanentAccessToken(fbAuth.AccessToken);					
					UpdateFacebookUserAuth(dbUserId, newPermanentToken.AccessToken, newPermanentToken.ExpiresAt);
				}				
			}

			result.UserId = dbUserId;

			//todo: implement some login service
			bool fbLogged = LogInFacebookUser(fbAuth);
			if (fbLogged)
			{
				result.Status = UserLogged.Successful;
			}
			else
			{
				//todo: implement other login types
				//todo: implement check on validity of token
			}
			

			ExtractVisitedCountries(fbAuth, dbUserId);


			return result;
		}
		
		public async void UpdateFacebookUserAuth(string dbUserId, string accessToken, DateTime expiresAt)
		{
			var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(dbUserId) );
			var update = Builders<BsonDocument>.Update
				.Set("Facebook.Authentication.AccessToken", accessToken)				
				.Set("Facebook.Authentication.ExpiresAt", expiresAt);
				
			//todo: remove ExpiresIn at all
			var result = await DB.UpdateAsync<PortalUserEntity>(update, filter);

			if (result.MatchedCount == 0)
			{
				//todo: make it nice here
				throw new Exception("something went wrong with update");
			}
		}

		private async void ExtractVisitedCountries(FacebookUserAuthenticationDO fbAuth, string dbUserId)
		{

			TaggedPlacesExtractor.SetUserData(fbAuth.AccessToken, fbAuth.UserId);

			TaggedPlacesExtractor.ExtractAll();
			
			var extractedPlaces = TaggedPlacesExtractor.UniquePlaces.Select(p => FacebookPlaceToVisitedPlace(p, dbUserId)).ToList();

			List<VisitedPlaceDO> newPlaces = await VisitedPlacesDomain.AddNewPlaces(extractedPlaces, dbUserId);
			var newCountriesList = newPlaces.Select(p => p.CountryCode).Distinct();
			var newCountriesDO = newCountriesList.Select(c => new VisitedCountryDO {CountryCode2 = c}).ToList();

			var newAddedCountries = await VisitedCountries.AddNewCountries(newCountriesDO, dbUserId);

		}

		private VisitedPlaceDO FacebookPlaceToVisitedPlace(FoundPlace fbPlace, string portalUserId)
		{
			var localPlace = new VisitedPlaceDO
			{
				City = fbPlace.City,
				CountryCode = fbPlace.CountryCode2,
				PlaceLatitude = fbPlace.Latitude,
				PlaceLongitude = fbPlace.Longitude,
				
				PortalUserId = portalUserId,

				SourceType = SourceTypeDO.Facebook,
				SourceId = fbPlace.CheckinId
			};
			return localPlace;
		}

		private string GeneratePassword()
		{
			//todo: implement
			return "NewPass";
		}

	}

	


}