using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
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

	    public static TripEntity GetInitialTripEntity(string name, string userId)
	    {
            var travel = new TripTravelSE
            {
                id = ObjectId.GenerateNewId(),
                Type = TravelType.Plane,
                LeavingDateTime = DateTime.UtcNow,
                ArrivingDateTime = DateTime.UtcNow.AddDays(1),
                Description = "Here you can place notes for your travel"
            };

            var firstPlace = new TripPlaceSE
            {
                id = ObjectId.GenerateNewId(),
                ArrivingId = ObjectId.Empty,
                LeavingId = travel.id,
                OrderNo = 1,
                Place = new PlaceSE
                {
                    SourceType = SourceType.City,
                    SourceId = "2643743",
                    SelectedName = "London, GB",
                    Coordinates = new LatLng { Lat = 51.50853, Lng = -0.12574 }
                },
                Description = "",
                WantVisit = new List<PlaceIdSE>()
            };

            var secondPlace = new TripPlaceSE
            {
                id = ObjectId.GenerateNewId(),
                ArrivingId = travel.id,
                LeavingId = ObjectId.Empty,
                OrderNo = 2,
                Place = new PlaceSE
                {
                    SourceType = SourceType.City,
                    SourceId = "5128581",
                    SelectedName = "New York, US",
                    Coordinates = new LatLng { Lat = 40.71427, Lng = -74.00597 }
                },
                Description = "",
                WantVisit = new List<PlaceIdSE>(),
            };

            var tripEntity = new TripEntity
            {
                id = ObjectId.GenerateNewId(),
                CreatedDate = DateTime.UtcNow,
                Name = name,
                PortalUser_id = new ObjectId(userId),
                Comments = new List<CommentSE>(),
                Files = new List<FileSE>(),
                Travels = new List<TripTravelSE> { travel },
                Places = new List<TripPlaceSE> { firstPlace, secondPlace },
                Participants = new List<ParticipantSE>(),
                FilesPublic = new List<FilePublicSE>(),
                NotesPublic = false,
                FriendsPublic = true,
                AllowToRequestJoin = false,
                SharingCode = null,
                Notes = "",
                Description = "",
                Picture = null                 
            };

	        return tripEntity;
	    }
	}
}