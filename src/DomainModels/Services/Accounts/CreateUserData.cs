using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class CreateUserData : ICreateUserData
	{
		public UserDO PortalUser { get; set; }
		public IDbOperations DB { get; set; }
		public INotificationsDomain NotificationDomain { get; set; }
		public IPlanningDomain PlanningDomain { get; set; }
		public IFriendsDomain FriendsService { get; set; }
		public IGeoNamesService GNService { get; set; }
		public IAirportService AirportSvc { get; set; }

		public async Task<bool>Create(UserDO portalUser)
		{
			PortalUser = portalUser;
		
			CreatePlanning();

			InitNotifications();
			await InitAirports();

			return true;
		}

		private void InitNotifications()
		{
			var notifications = new Notifications();
			var notification = notifications.NewAccountNotification(PortalUser.UserId);
			NotificationDomain.AddNotification(notification);
		}

		private async Task<bool> InitAirports()
		{
			//todo: maybe in this case try to get location by IP
			if (PortalUser.CurrentLocation != null)
			{
				CityDO city = await GNService.GetCityByIdAsync(PortalUser.CurrentLocation.GeoNamesId);

				var airports = AirportSvc.GetAirportsInRange(city.Coordinates, 100);
				await AirportSvc.SaveAirportsInRange(PortalUser.UserId, airports);
				return true;
			}
			return false;
		}

		private void CreatePlanning()
		{
			PlanningDomain.CreateDBStructure(PortalUser.UserId);
		}
	}
}