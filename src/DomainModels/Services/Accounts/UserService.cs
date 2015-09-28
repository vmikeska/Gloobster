using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.CommonEnums;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Newtonsoft.Json.Linq;
using System.Linq;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class UserService: IUserService
	{
		public IAccountDriver AccountDriver { get; set; }
		public IComponentContext ComponentContext { get; set; }
		public IDbOperations DB { get; set; }
		
		public async Task<UserLoggedResultDO> Validate(SocAuthenticationDO authentication, object userObj)
		{
			AccountDriver.Authentication = authentication;
			AccountDriver.UserObj = userObj;

			var result = new UserLoggedResultDO();

			PortalUserDO portalUser = await Load();

			bool userExists = portalUser != null;
			if (!userExists)						
			{
				string email = AccountDriver.GetEmail();
				bool emailExists = EmailAlreadyExistsInSystem(email);
				if (emailExists)
				{
					//todo: stop registration, ask for pairing
				}
				
				portalUser = await AccountDriver.Create();
			}
			else
			{
				AccountDriver.OnUserExists(portalUser);
			}

			result.EncodedToken = LogIn(portalUser.UserId);
			result.Status = UserLogged.Successful;
			AccountDriver.OnUserSuccessfulyLogged(portalUser);
			return result;
		}

		public async Task<PortalUserDO> Load()
		{
			string query;

			if (AccountDriver.NetworkType == SocialNetworkType.Base)
			{
				var user = (BaseUserDO) AccountDriver.UserObj;
				var mail = user.Mail.Trim();
				query = $"{{ 'Mail': '{mail}' }}";				
			}
			else
			{			
				string userId = AccountDriver.Authentication.UserId;
				query = $"{{ 'SocialAccounts.NetworkType': {(int)AccountDriver.NetworkType}, 'SocialAccounts.Authentication.UserId': '{userId}' }}";				
			}

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

		private string LogIn(string portalUserId)
		{
			var token = IssueToken(portalUserId);
			return token;
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