using System.Collections.Generic;
using System.Linq;
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
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripShareController : BaseApiController
	{
		public TripShareController(ILogger log, IDbOperations db) : base(log, db)
		{			
		}

		[HttpGet]
		[AuthorizeAttributeApi]
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
					id = place.id.ToString(),
					orderNo = place.OrderNo,
					place = place.Place.ToResponse(),					
				};

				bool hasLeaving = place.LeavingId != ObjectId.Empty;
				bool hasArriving = place.ArrivingId != ObjectId.Empty;

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

		private TripTravelSE GetTravel(TripEntity trip, ObjectId travelId)
		{
			return trip.Travels.FirstOrDefault(t => t.id == travelId);
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
	}	
}