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

			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (request.dialogType == TripEntityType.Place)
			{
				var place = trip.Places.FirstOrDefault(p => p.id == entityIdObj);
                //todo: permission, should send just appropriate data
                var response = place.ToResponse();

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
				TripTravelSE travel = trip.Travels.FirstOrDefault(p => p.id == entityIdObj);
                //todo: permission, should send just appropriate data
				var response = travel.ToResponse();

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