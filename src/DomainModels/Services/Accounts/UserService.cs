using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Newtonsoft.Json.Linq;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Microsoft.AspNet.Http;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Accounts
{
	

	public class UserService: IUserService
	{
		public IAccountDriver AccountDriver { get; set; }
		public IComponentContext ComponentContext { get; set; }		
		public IDbOperations DB { get; set; }		
		public ICreateUserData UserData { get; set; }

		public async Task<UserLoggedResultDO> Validate(SocAuthenticationDO authentication, object userObj)
		{
			AccountDriver.Authentication = authentication;
			AccountDriver.UserObj = userObj;
			
			PortalUserDO portalUser = await Load();
			
			bool userExists = portalUser != null;
			if (!userExists)
			{
				string email = AccountDriver.GetEmail();
				bool emailExists = EmailAlreadyExistsInSystem(email);
				if (emailExists)
				{
					return new UserLoggedResultDO
					{
						Status = UserLogged.MailAlreadyExists
					};
				}
				
				portalUser = await AccountDriver.Create();
				await CreateCommonAsync(portalUser);
			}
			else
			{
				bool validCredintials = CheckCredintials(authentication, portalUser);
				if (!validCredintials)
				{
					return new UserLoggedResultDO
					{
						Status = UserLogged.BadCredintials
					};
				}

				AccountDriver.OnUserExists(portalUser);
			}

			var result = new UserLoggedResultDO
			{
				EncodedToken = IssueToken(portalUser.UserId),
				Status = UserLogged.Successful,
				UserId = portalUser.UserId
			};

			AccountDriver.OnUserSuccessfulyLogged(portalUser);
			
			return result;
		}

		private async Task<bool> CreateCommonAsync(PortalUserDO portalUser)
		{
			await UserData.Create(portalUser);
			return true;
		}

		private bool CheckCredintials(SocAuthenticationDO socAuthentication, PortalUserDO portalUser)
		{
			if (AccountDriver.NetworkType == SocialNetworkType.Base)
			{
				return AccountDriver.CheckCredintials(AccountDriver.UserObj, portalUser);
			}
			else
			{
				return AccountDriver.CheckCredintials(socAuthentication, portalUser);
			}
		}

		public async Task<PortalUserDO> Load()
		{			
			if (AccountDriver.NetworkType == SocialNetworkType.Base)
			{
				var user = (BaseUserDO) AccountDriver.UserObj;
				var mail = user.Mail.Trim();
				var dbUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.Mail == mail);
				return dbUser.ToDO();
			}
	
			string userId = AccountDriver.Authentication.UserId;				
			var query = $"{{ 'SocialAccounts.NetworkType': {(int)AccountDriver.NetworkType}, 'SocialAccounts.Authentication.UserId': '{userId}' }}";
			var results = await DB.FindAsync<PortalUserEntity>(query);

			if (!results.Any())
			{
				return null;
			}
				
			var result = results.First().ToDO();
			return result;
		}
		
		private bool EmailAlreadyExistsInSystem(string email)
		{
			//todo:
			return false;
		}
		
		private string IssueToken(string portalUserId)
		{
			//since here user is valid, lets create the token
			var tokenObj = new AuthorizationToken(portalUserId);
			var tokenStr = Newtonsoft.Json.JsonConvert.SerializeObject(tokenObj);
			var tokenJson = JObject.Parse(tokenStr);

			var encodedToken = JsonWebToken.Encode(tokenJson, GloobsterConfig.AppSecret, JwtHashAlgorithm.RS256);
			return encodedToken;
		}
	}
}