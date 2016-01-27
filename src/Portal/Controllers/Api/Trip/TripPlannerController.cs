using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripPlannerController : BaseApiController
	{
		public ITripPlannerDomain TripPlanner { get; set; }
		
		public TripPlannerController(ITripPlannerDomain plannerDomain, ILogger log, IDbOperations db) : base(log, db)
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
				place = addResult.Place.ToResponse(),
				travel = addResult.Travel.ToResponse()
			};

			return new ObjectResult(response);
		}		
	}
}