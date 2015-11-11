using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripPlannerController : BaseApiController
	{		
		public ITripPlannerDomain TripPlanner { get; set; }
		
		public TripPlannerController(ITripPlannerDomain plannerDomain, IDbOperations db) : base(db)
		{
			TripPlanner = plannerDomain;
		}
		
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody] NewPlaceRequest request)
		{
			var newPlaceDO = new NewPlaceDO
			{
				Position = request.position,	
				SelectorId = request.selectorId				
			};

			TripPlanner.Initialize(request.tripId, UserId);

			AddPlaceResultDO addResult = await TripPlanner.AddPlace(newPlaceDO);

			var response = new NewPlaceResponse
			{
				position = addResult.Position,
				place = new PlaceLiteResponse
				{
					id = addResult.Place.Id,
					orderNo = addResult.Place.OrderNo,
					leavingId = addResult.Place.LeavingId,
					arrivingId = addResult.Place.ArrivingId
				},
				travel = new TravelLiteResponse
				{
					id = addResult.Travel.Id,
					type = addResult.Travel.Type
				}
			};

			return new ObjectResult(response);
		}		
	}
}