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
		public IFriendsDomain FriendsService { get; set; }
		public IDbOperations DB { get; set; }
		public IPlanningDomain PlanningDomain { get; set; }
		public IAirportService AirportSvc { get; set; }
		public IGeoNamesService GNService { get; set; }

		public INotificationsDomain NotificationDomain { get; set; }


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
				CreateCommonAsync(portalUser);
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

			//todo: remove later
			//await FriendsService.AddEverbodyToMyFriends(portalUser.UserId);

			return result;
		}

		private async void CreateCommonAsync(PortalUserDO portalUser)
		{
			await FriendsService.CreateFriendsObj(portalUser.UserId);
			PlanningDomain.CreateDBStructure(portalUser.UserId);

			//todo: maybe in this case try to get location by IP
			if (portalUser.CurrentLocation != null)
			{
				CityDO city = GNService.GetCityById(portalUser.CurrentLocation.GeoNamesId);

				var airports = AirportSvc.GetAirportsInRange(city.Coordinates, 100);
				await AirportSvc.SaveAirportsInRange(portalUser.UserId, airports);
			}

			var notifications = new Notifications();
			var notification = notifications.NewAccountNotification(portalUser.UserId);
			NotificationDomain.AddNotification(notification);
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