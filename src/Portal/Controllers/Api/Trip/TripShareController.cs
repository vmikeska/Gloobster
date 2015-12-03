using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripShareController : BaseApiController
	{
		public ITripShareDomain ShareDomain { get; set; }

		public TripShareController(ITripShareDomain tripShareDom, IDbOperations db) : base(db)
		{
			ShareDomain = tripShareDom;
		}

		[HttpGet]
		[Authorize]
		public IActionResult Get(string tripId)
		{
			var tripIdObj = new ObjectId(tripId);
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			var owner = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == trip.PortalUser_id);

			var response = new TripShareResponse
			{
				name = trip.Name,
				tripId = trip.id.ToString(),
				owner = new TripUsersResponse
				{
					id = owner.id.ToString(), 
					displayName = owner.DisplayName,
					photoUrl = owner.ProfileImage
				},
				participants = GetParticipants(trip),
				places = GetPlaces(trip)
			};
			

			return new ObjectResult(response);
		}

		private List<TripPlaceShareResponse> GetPlaces(TripEntity trip)
		{
			var places = new List<TripPlaceShareResponse>();
			foreach (var place in trip.Places)
			{
				var plc = new TripPlaceShareResponse
				{
					id = place.Id,
					orderNo = place.OrderNo,
					place = place.Place.ToResponse(),					
				};

				bool hasLeaving = !string.IsNullOrEmpty(place.LeavingId);
				bool hasArriving = !string.IsNullOrEmpty(place.ArrivingId);

				if (hasLeaving)
				{
					var leavingTravel = GetTravel(trip, place.LeavingId);
					plc.leavingDateTime = plc.leavingDateTime = leavingTravel.LeavingDateTime;
				}

				if (hasArriving)
				{
					var arrivingTravel = GetTravel(trip, place.ArrivingId);
					plc.arrivingDateTime = plc.arrivingDateTime = arrivingTravel.ArrivingDateTime;
				}

				places.Add(plc);
			}

			return places;
		}

		private TripTravelSE GetTravel(TripEntity trip, string travelId)
		{
			return trip.Travels.FirstOrDefault(t => t.Id == travelId);
		}

		private List<TripUsersResponse> GetParticipants(TripEntity trip)
		{
			var participantsIds = trip.Participants.Select(p => p.PortalUser_id);
			var participants = DB.C<PortalUserEntity>().Where(u => participantsIds.Contains(u.id)).ToList();
			var participantsRes = participants.Select(u => new TripUsersResponse
			{
				id = u.id.ToString(),
				displayName = u.DisplayName,
				photoUrl = u.ProfileImage
			}).ToList();

			return participantsRes;
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]ShareRequest request)
		{
			
			//todo: check rights for this tripId

			var participants = request.users.Select(u => u.ToDO()).ToList();
			ShareDomain.InvitePaticipants(participants, request.tripId);
			
			return new ObjectResult(null);
		}

		

	}
}