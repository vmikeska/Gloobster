using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripPlannerPropertyController : BaseApiController
	{
		public ITripPlannerDomain TripPlanner { get; set; }


		public TripPlannerPropertyController(ITripPlannerDomain tripPlannerDomain, ILogger log, IDbOperations db) : base(log, db)
		{
			TripPlanner = tripPlannerDomain;
		}

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(DialogRequest request)
		{
			object objToReturn = null;
		    var entityIdObj = new ObjectId(request.id);

			var tripIdObj = new ObjectId(request.tripId);

			var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

			if (request.dialogType == TripEntityType.Place)
			{
				TripPlaceSE place = trip.Places.FirstOrDefault(p => p.id == entityIdObj);
                //todo: permission, should send just appropriate data
                TripPlaceResponse response = place.ToResponse();

			    response.isLastPlace = trip.Places.Max(p => p.OrderNo) == place.OrderNo;
			    response.placesCount = trip.Places.Count;
			    response.tripId = trip.id.ToString();

                TripTravelSE arrivingTravel = GetTravelById(trip, place.ArrivingId);
                TripTravelSE leavingTravel = GetTravelById(trip, place.LeavingId);

			    if (arrivingTravel?.ArrivingDateTime != null)
			    {
			        response.arrivingDateTime = arrivingTravel.ArrivingDateTime.Value;
			    }

                if (leavingTravel?.LeavingDateTime != null)
                {
                    response.leavingDateTime = leavingTravel.LeavingDateTime.Value;
                }

                if (trip.Files != null)
				{
					var entityFiles = trip.Files.Where(f => f.EntityId == request.id).ToList();
					response.files = entityFiles.Select(f => f.ToResponse()).ToList();
                    var fileIds = entityFiles.Select(f => f.id).ToList();
				    response.filesPublic = trip.FilesPublic
                        .Where(fp => fileIds.Contains(fp.File_id))
                        .Select(f => f.ToResponse()).ToList();
				}

				objToReturn = response;
			}

			if (request.dialogType == TripEntityType.Travel)
			{
				TripTravelSE travel = GetTravelById(trip, entityIdObj);
                //todo: permission, should send just appropriate data
				TripTravelResponse response = travel.ToResponse();

				if (trip.Files != null)
				{
					var entityFiles = trip.Files.Where(f => f.EntityId == request.id).ToList();
					response.files = entityFiles.Select(f => f.ToResponse()).ToList();
                    var fileIds = entityFiles.Select(f => f.id).ToList();
                    response.filesPublic = trip.FilesPublic
                        .Where(fp => fileIds.Contains(fp.File_id))
                        .Select(f => f.ToResponse()).ToList();
                }

				objToReturn = response;
			}

			return new ObjectResult(objToReturn);
		}

	    private TripTravelSE GetTravelById(TripEntity trip, ObjectId id)
	    {
            TripTravelSE travel = trip.Travels.FirstOrDefault(p => p.id == id);
	        return travel;
	    }

		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] PropertyUpdateRequest request)
		{
			var tripId = request.values["tripId"];
			TripPlanner.Initialize(tripId, UserId);
			var result = await TripPlanner.UpdateProperty(request.propertyName, request.values);
		
			return new ObjectResult(result);
		}        
    }
}