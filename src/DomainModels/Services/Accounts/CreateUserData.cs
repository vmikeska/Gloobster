using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class CreateUserData : ICreateUserData
	{
		public PortalUserDO PortalUser { get; set; }
		public IDbOperations DB { get; set; }
		public INotificationsDomain NotificationDomain { get; set; }
		public IPlanningDomain PlanningDomain { get; set; }
		public IFriendsDomain FriendsService { get; set; }
		public IGeoNamesService GNService { get; set; }
		public IAirportService AirportSvc { get; set; }

		public async Task<bool>Create(PortalUserDO portalUser)
		{
			PortalUser = portalUser;

			await CreateVisited();			
			CreatePlanning();
			CreateFriends();

			InitNotifications();
			await InitAirports();

			//todo: remove later
			//await FriendsService.AddEverbodyToMyFriends(portalUser.UserId);

			return true;
		}

		private async Task<bool> CreateVisited()
		{
			var visited = new VisitedEntity
			{
				PortalUser_id = new ObjectId(PortalUser.UserId),
				Places = new List<VisitedPlaceSE>(),
				Cities = new List<VisitedCitySE>(),
				Countries = new List<VisitedCountrySE>(),
                States = new List<VisitedStateSE>()
			};
			await DB.SaveAsync(visited);
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

		private async void CreateFriends()
		{
			await FriendsService.CreateFriendsObj(PortalUser.UserId);
		}
	}
}