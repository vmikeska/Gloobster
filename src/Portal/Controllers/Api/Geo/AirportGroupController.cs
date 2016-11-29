using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Airport;
using Microsoft.AspNet.Mvc;
using Gloobster.Entities.Planning;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Geo
{
	[Route("api/[controller]")]
	public class AirportGroupController : BaseApiController
	{						
		public IAirportGroupService AirportGroupDomain { get; set; }

		public AirportGroupController(IAirportGroupService agd, ILogger log, IDbOperations db) : base(log, db)
		{						
			AirportGroupDomain = agd;
		}

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(AirportGroupRequest req)
		{
			var rect = new RectDO
			{
				LngWest = req.lngWest,
				LngEast = req.lngEast,
				LatNorth = req.latNorth,
				LatSouth = req.latSouth
			};

			var citiesDO = AirportGroupDomain.GetCitiesInRange(rect, req.minPopulation);
			var cities = citiesDO.Select(c => ToResponse(c)).ToList();

			if (req.planningType.HasValue)
			{
				if (req.planningType.Value == PlanningType.Anytime)
				{
					var anytime = DB.FOD<PlanningAnytimeEntity>(p => p.User_id == UserIdObj);

				    if (anytime == null)
				    {
                        return new ObjectResult(null);
                    }

                    cities.ForEach(c => c.selected = anytime.Cities.Contains(c.gid));
				}

				if (req.planningType.Value == PlanningType.Weekend)
				{
					var weekend = DB.FOD<PlanningWeekendEntity>(p => p.User_id == UserIdObj);

                    if (weekend == null)
                    {
                        return new ObjectResult(null);
                    }

                    cities.ForEach(c => c.selected = weekend.Cities.Contains(c.gid));
				}

                //todo: what is it for ?

                if (req.planningType.Value == PlanningType.Custom)
                {
                    var customIdObj = new ObjectId(req.customId);

                    var custom = DB.FOD<PlanningCustomEntity>(p => p.User_id == UserIdObj);

                    if (custom == null)
                    {
                        return new ObjectResult(null);
                    }

                    var selectedSearch = custom.Searches.FirstOrDefault(c => c.id == customIdObj);

                    if (selectedSearch == null)
                    {
                        return new ObjectResult(null);
                    }

                    cities.ForEach(c => c.selected = selectedSearch.GIDs.Contains(c.gid));
                }
            }

			return new ObjectResult(cities);
		}

		private AirportGroupResponse ToResponse(NewAirportCityDO d)
		{
			var r = new AirportGroupResponse
			{
				city = d.Name,
				countryCode = d.CountryCode,
				coord = d.Coord,
				gid = d.GID,
				population = d.Population
			};
			return r;
		}
	}	
}