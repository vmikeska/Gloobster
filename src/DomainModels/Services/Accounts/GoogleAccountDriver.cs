using System;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.CommonEnums;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
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
		public SocialNetworkType NetworkType => SocialNetworkType.Google;

		public IDbOperations DB { get; set; }
		public IFacebookService FBService { get; set; }
		
		public IComponentContext ComponentContext { get; set; }

		public IPlacesExtractor PlacesExtractor { get; set; }
		
		public PortalUserDO PortalUser { get; set; }

		public SocAuthenticationDO Authentication { get; set; }
		public object UserObj { get; set; }
		private GoogleUserRegistrationDO User => (GoogleUserRegistrationDO) UserObj;

		public async Task<PortalUserDO> Create()
		{

			var googleAccount = new SocialAccountSE
			{
				Authentication = Authentication.ToEntity(),
				NetworkType = SocialNetworkType.Google,
				Specifics = new GoogleUserSE
				{
					ProfileLink = User.ProfileLink
				}
			};
			
			var userEntity = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = User.DisplayName,
				Mail = User.Mail,
				Password = AccountUtils.GeneratePassword(),
				ProfileImage = AccountUtils.DownloadAndStoreTheProfilePicture(User.ProfileLink),
				
				SocialAccounts = new[] {googleAccount},

				FirstName = "",
				LastName = "",
				HomeLocation = null,
				Gender = Gender.N,
				Languages = null,
				CurrentLocation = null
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			var createdUser = savedEntity.ToDO();
			return createdUser;
		}
		
		public string GetEmail()
		{
			//todo: implement
			return "unique";
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			UpdateGoogleUserAuth(portalUser.UserId, SocialNetworkType.Google, Authentication.AccessToken, Authentication.ExpiresAt);
		}

		public void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
		}
		
		//todo
		private async void UpdateGoogleUserAuth(string dbUserId, SocialNetworkType networkType, string accessToken, DateTime expiresAt)
		{
			var builder = Builders<BsonDocument>.Filter;
			var filter = builder.Eq("_id", new ObjectId(dbUserId)) & builder.Eq("SocialAccounts.NetworkType", ((int)networkType));

			var update = Builders<BsonDocument>.Update				
				.Set("Mail", "mikeska@gmail.com")
				.Set("SocialAccounts.Authentication.AccessToken", accessToken)
				.Set("SocialAccounts.Specifics", new GoogleUserSE());
			//.Set("SocialAccounts.Authentication.AccessToken", accessToken)
			//.Set("SocialAccounts.Authentication.ExpiresAt", expiresAt);

			var result = await DB.UpdateAsync<PortalUserEntity>(update, filter);

			if (result.MatchedCount == 0)
			{
				//todo: make it nice here
				throw new Exception("something went wrong with update");
			}
		}
	}
}