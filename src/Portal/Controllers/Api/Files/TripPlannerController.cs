using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Api.Files
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
		public IActionResult Post([FromBody] NewPlaceRequest request)
		{
			var newPlaceDO = new NewPlaceDO
			{
				Position = request.position,	
				SelectorId = request.selectorId				
			};

			TripPlanner.Initialize(request.tripId, UserId);

			AddPlaceResultDO addResult = TripPlanner.AddPlace(newPlaceDO);

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


	public class NewPlaceRequest
	{
		public string selectorId { get; set; }
        public NewPlacePosition position { get; set; }

		public string tripId { get; set; }
				
	}

	public class NewPlaceResponse
	{
		public NewPlacePosition position { get; set; }

		public PlaceLiteResponse place { get; set; }

		public TravelLiteResponse travel { get; set; }
	}

	public class PlaceLiteResponse
	{
		public string id { get; set; }
		public string arrivingId { get; set; }
		public string leavingId { get; set; }
		public int orderNo { get; set; }
	}

	public class TravelLiteResponse
	{
		public string id { get; set; }

		public TravelType type { get; set; }
	}
}