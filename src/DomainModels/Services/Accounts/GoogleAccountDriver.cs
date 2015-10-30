using System;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class GoogleAccountDriver : IAccountDriver
	{
		public bool CheckCredintials(object authObject, PortalUserDO portalUser)
		{
			//todo: implement
			return true;
		}

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
			return User.Mail;
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			UpdateGoogleUserAuth(portalUser, Authentication.AccessToken, Authentication.ExpiresAt);
		}

		public void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
		}
				
		private async void UpdateGoogleUserAuth(PortalUserDO portalUser, string accessToken, DateTime expiresAt)
		{
			var portalUserEntity = portalUser.ToEntity();
			var socialAccount = portalUserEntity.SocialAccounts.First(a => a.NetworkType == SocialNetworkType.Google);
			socialAccount.Authentication.AccessToken = accessToken;
			socialAccount.Authentication.ExpiresAt = expiresAt;
			
			var result = await DB.ReplaceOneAsync(portalUserEntity);

			if (result.MatchedCount == 0)
			{
				//todo: make it nice here
				throw new Exception("something went wrong with update");
			}
		}
	}
}