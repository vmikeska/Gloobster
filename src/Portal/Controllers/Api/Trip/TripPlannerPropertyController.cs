using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities.Trip;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripPlannerPropertyController : BaseApiController
	{
		public ITripPlannerDomain TripPlanner { get; set; }


		public TripPlannerPropertyController(ITripPlannerDomain tripPlannerDomain, IDbOperations db) : base(db)
		{
			TripPlanner = tripPlannerDomain;
		}

		[HttpGet]
		[Authorize]
		public IActionResult Get(DialogRequest request)
		{
			object objToReturn = null;

			var tripIdObj = new ObjectId(request.tripId);

			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (request.dialogType == "place")
			{
				var place = trip.Places.FirstOrDefault(p => p.Id == request.id);
				objToReturn = place.ToResponse();
			}

			if (request.dialogType == "travel")
			{
				var travel = trip.Travels.FirstOrDefault(p => p.Id == request.id);
				objToReturn = travel.ToResponse();
			}

			return new ObjectResult(objToReturn);
		}

		[HttpPut]
		[Authorize]
		public async Task<IActionResult> Put([FromBody] PropertyUpdateRequest request)
		{
			var result = TripPlanner.UpdateProperty(request.propertyName, request.values);
		
			return new ObjectResult(result);
		}
		
	}
}