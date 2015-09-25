using System;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class GoogleAccountDriver : IAccountDriver
	{
		public IDbOperations DB { get; set; }
		public IFacebookService FBService { get; set; }
		
		public IComponentContext ComponentContext { get; set; }

		public IPlacesExtractor PlacesExtractor { get; set; }
		
		public PortalUserDO PortalUser { get; set; }

		public object UserObj { get; set; }
		private GoogleUserRegistrationDO User => (GoogleUserRegistrationDO) UserObj;

		public async Task<PortalUserDO> Create()
		{
			var userEntity = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = User.DisplayName,
				Mail = User.Mail,
				Password = AccountUtils.GeneratePassword(),
				Google = new GoogleGroupEntity
				{
					Authentication = new GoogleUserAuthenticationEntity
					{
						AccessToken = User.AccessToken,
						ExpiresAt = User.ExpiresAt,
						UserId = User.UserId
					},
					GoogleUser = new GoogleUserEntity
					{
						UserId = User.UserId,
						DisplayName = User.DisplayName,
						Mail = User.Mail,
						ProfileLink = User.ProfileLink
					}
				}
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			var createdUser = savedEntity.ToDO();
			return createdUser;
		}

		public async Task<PortalUserDO> Load()
		{
			var query = $"{{ 'Google.GoogleUser.UserId': '{User.UserId}' }}";
			var results = await DB.FindAsync<PortalUserEntity>(query);

			if (!results.Any())
			{
				return null;
			}

			var result = results.First().ToDO();
			return result;
		}

		public string GetEmail()
		{
			//todo: implement
			return "unique";
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			UpdateGoogleUserAuth(portalUser.DbUserId, User.AccessToken, User.ExpiresAt);
		}

		public void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
		}
		
		private async void UpdateGoogleUserAuth(string dbUserId, string accessToken, DateTime expiresAt)
		{
			var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(dbUserId));
			var update = Builders<BsonDocument>.Update
				.Set("Google.Authentication.AccessToken", accessToken)
				.Set("Google.Authentication.ExpiresAt", expiresAt);
			
			var result = await DB.UpdateAsync<PortalUserEntity>(update, filter);

			if (result.MatchedCount == 0)
			{
				//todo: make it nice here
				throw new Exception("something went wrong with update");
			}
		}	
	}
}