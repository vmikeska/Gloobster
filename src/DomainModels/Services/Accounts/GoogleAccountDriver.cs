using System;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.ReqRes.Google;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class GoogleAccountDriver : IAccountDriver
	{
		public bool CheckCredintials(object authObject, UserDO portalUser)
		{
			var socAuth = (SocAuthenticationDO)authObject;
			var url = "https://www.googleapis.com/oauth2/v1/tokeninfo";

			try
			{
				using (var client = new WebClient())
				{
					var values = new NameValueCollection {["access_token"] = socAuth.AccessToken};
					byte[] response = client.UploadValues(url, values);
					var resp = Encoding.Default.GetString(response);
					var authObj = JsonConvert.DeserializeObject<GoogleAuthValidation>(resp);

					bool verified = !string.IsNullOrEmpty(authObj.email);
					return verified;
				}
			}
			catch (Exception exc)
			{
				return false;
			}
		}

		public SocialNetworkType NetworkType => SocialNetworkType.Google;

		public IDbOperations DB { get; set; }
		public IFacebookService FBService { get; set; }		
		public IComponentContext ComponentContext { get; set; }
        public IFilesDomain FileDomain { get; set; }
        public IPlacesExtractor PlacesExtractor { get; set; }
		
		public UserDO PortalUser { get; set; }

		public SocAuthenticationDO Authentication { get; set; }
		public object UserObj { get; set; }
		private GoogleUserRegistrationDO User => (GoogleUserRegistrationDO) UserObj;

		public async Task<UserDO> Create()
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
			
			var userEntity = new UserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = User.DisplayName,
				//Mail = User.Mail,
				//Password = AccountUtils.GeneratePassword(),
				//ProfileImage = null,
				
				FirstName = "",
				LastName = "",
				HomeLocation = null,
				Gender = Gender.N,
				Languages = null,
				CurrentLocation = null
			};

			var savedEntity = await DB.SaveAsync(userEntity);
			var createdUser = savedEntity.ToDO();
            
            DownloadPictureResult picResult = AccountUtils.DownloadPicture(User.ProfileLink);
            AccountUtils.SaveProfilePicture(picResult.Data, picResult.ContentType, savedEntity.id.ToString(), FileDomain, DB);

            return createdUser;
		}
		
		public string GetEmail()
		{
			return User.Mail;
		}

		public void OnUserExists(UserDO portalUser)
		{
			UpdateGoogleUserAuth(portalUser, Authentication.AccessToken, Authentication.ExpiresAt);
		}

		public void OnUserSuccessfulyLogged(UserDO portalUser)
		{
		}
				
		private async void UpdateGoogleUserAuth(UserDO portalUser, string accessToken, DateTime expiresAt)
		{
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
		}
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