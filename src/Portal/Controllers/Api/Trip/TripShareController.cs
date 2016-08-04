using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Gloobster.Common;
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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp.Deserializers;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripShareController : BaseApiController
	{
        public TripShareController(ILogger log, IDbOperations db) : base(log, db)
        {
            
        }

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(string tripId)
		{
			var tripIdObj = new ObjectId(tripId);
			var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

			var owner = DB.FOD<UserEntity>(u => u.User_id == trip.User_id);

		    List<TripPlaceShareResponse> places = GetPlaces(trip);
		    
            var response = new TripShareResponse
			{
				name = trip.Name,
				tripId = trip.id.ToString(),
				owner = new TripUsersResponse
				{
					id = owner.User_id.ToString(), 
					displayName = owner.DisplayName
				},
				participants = GetParticipants(trip),
				places = places,
                travels = GetTravels(trip, places)
			};
			
			return new ObjectResult(response);
		}

	    private List<TripTravelShareResponse> GetTravels(TripEntity trip, List<TripPlaceShareResponse> places)
	    {
	        var travels = new List<TripTravelShareResponse>();

	        foreach (var place in places)
	        {
	            if (!string.IsNullOrEmpty(place.leavingId))
	            {
	                var t = GetTravel(trip, new ObjectId(place.leavingId));

	                var travel = new TripTravelShareResponse
	                {
	                    id = t.id.ToString(),
                        waypoints = t.WayPoints,
                        type = t.Type
	                };

                    travels.Add(travel);
	            }
	        }

	        return travels;
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
				    plc.leavingId = leavingTravel.id.ToString();                    
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
			var participantsIds = trip.Participants.Select(p => p.User_id);
			var participants = DB.C<UserEntity>().Where(u => participantsIds.Contains(u.id)).ToList();
			var participantsRes = participants.Select(u => new TripUsersResponse
			{
				id = u.id.ToString(),
				displayName = u.DisplayName
			}).ToList();

			return participantsRes;
		}		
	}	
}