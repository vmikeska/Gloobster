using System;
using System.Linq;
using System.Threading.Tasks;
using Facebook;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.User;
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


		public FacebookUserDomain(IDbOperations db, IFacebookService fbService, IFacebookTaggedPlacesExtractor taggedPlacesExtractor)
		{
			DB = db;
			FBService = fbService;
			TaggedPlacesExtractor = taggedPlacesExtractor;
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

			var fbExistResult = await FacebookUserExists(fbAuth.UserID);

			if (!fbExistResult.UserExists)
			{
				await CreateFacebookUser(fbAuth);
				result.RegisteredNewUser = true;
			}
			else
			{
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


			ExtractVisitedCountries(fbAuth);


			return result;
		}

		public async void UpdateFacebookUserAuth(FacebookUserAuthenticationDO fbAuth)
		{
			var fbAuthEntity = fbAuth.ToEntity();

			var filter = Builders<BsonDocument>.Filter.Eq("Facebook.Authentication.UserId", fbAuth.UserID);
			var update = Builders<BsonDocument>.Update
				.Set("Facebook.Authentication.AccessToken", fbAuth.AccessToken)
				.Set("Facebook.Authentication.UserId", fbAuth.UserID);
				//todo: possibly remove SignedRequest and ExpiresIn at all
			var result = await DB.UpdateAsync<PortalUserEntity>(update, filter);

			
		}

		private void ExtractVisitedCountries(FacebookUserAuthenticationDO fbAuth)
		{

			TaggedPlacesExtractor.SetUserData(fbAuth.AccessToken, fbAuth.UserID);

			TaggedPlacesExtractor.ExtractAll();

			

		}

		private string GeneratePassword()
		{
			//todo: implement
			return "NewPass";
		}

	}

	


}