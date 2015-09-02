using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Facebook;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModels.Services.TaggedPlacesExtractor;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.DomainModels
{
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
			var fbUserExists = await FacebookUserExists(fbUserAuthentication.UserID);
			if (fbUserExists.UserExists)
			{
				return new CreateFacebookUserResultDO {Status = UserCreated.UserExists};
			}

			//todo: check if email exists in the system already

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
					Authentication = fbUserAuthentication.ToEntity(),
					FacebookUser = resultEntity
				}
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			return new CreateFacebookUserResultDO {Status = UserCreated.Successful, CreatedUser = savedEntity.ToDO()};
		}

		public async Task<UserLoggedResultDO> ValidateFacebookUser(FacebookUserAuthenticationDO fbAuth)
		{
			var result = new UserLoggedResultDO {IsFacebook = true, IsStandardUser = false, RegisteredNewUser = false};

			string dbUserId;

			var fbExistResult = await FacebookUserExists(fbAuth.UserID);

			if (!fbExistResult.UserExists)
			{
				var newUser = await CreateFacebookUser(fbAuth);
				dbUserId = newUser.CreatedUser.DbUserId;
				result.RegisteredNewUser = true;
			}
			else
			{
				dbUserId = fbExistResult.PortalUser.DbUserId;
				UpdateFacebookUserAuth(fbAuth);
			}

			//todo: implement some login service
			bool fbLogged = LogInFacebookUser(fbAuth);
			if (fbLogged)
			{
				result.Status = UserLogged.Successful;
			}
			//else
			//{
			//	result.Status = UserLogged.UnknownFailure;
			//}


			ExtractVisitedCountries(fbAuth, dbUserId);


			return result;
		}

		public async void UpdateFacebookUserAuth(FacebookUserAuthenticationDO fbAuth)
		{
			var fbAuthEntity = fbAuth.ToEntity();

			var filter = Builders<BsonDocument>.Filter.Eq("Facebook.Authentication.PortalUser_id", fbAuth.UserID);
			var update = Builders<BsonDocument>.Update
				.Set("Facebook.Authentication.AccessToken", fbAuth.AccessToken)
				.Set("Facebook.Authentication.PortalUser_id", fbAuth.UserID);
				//todo: possibly remove SignedRequest and ExpiresIn at all
			var result = await DB.UpdateAsync<PortalUserEntity>(update, filter);

			
		}

		private async void ExtractVisitedCountries(FacebookUserAuthenticationDO fbAuth, string dbUserId)
		{

			TaggedPlacesExtractor.SetUserData(fbAuth.AccessToken, fbAuth.UserID);

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