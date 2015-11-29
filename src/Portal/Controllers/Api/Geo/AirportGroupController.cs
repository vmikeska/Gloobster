using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Airport;
using Microsoft.AspNet.Mvc;
using Gloobster.Common;
using Gloobster.Entities.Planning;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Geo
{
	[Route("api/[controller]")]
	public class AirportGroupController : BaseApiController
	{						
		public IAirportGroupService AirportGroupDomain { get; set; }

		public AirportGroupController(IAirportGroupService agd, IDbOperations db) : base(db)
		{						
			AirportGroupDomain = agd;
		}

		[HttpGet]
		[Authorize]
		public IActionResult Get(AirportGroupRequest req)
		{
			var rect = new RectDO
			{
				LngWest = req.lngWest,
				LngEast = req.lngEast,
				LatNorth = req.latNorth,
				LatSouth = req.latSouth
			};

			List<AirportGroupDO> citiesDO = AirportGroupDomain.GetCitiesInRange(rect, req.minPopulation);
			var cities = citiesDO.Select(c => ToResponse(c)).ToList();

			if (req.planningType.HasValue)
			{
				if (req.planningType.Value == PlanningType.Anytime)
				{
					var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(p => p.PortalUser_id == UserIdObj);
					cities.ForEach(c => c.selected = anytime.Cities.Contains(c.gid));
				}

				if (req.planningType.Value == PlanningType.Weekend)
				{
					var weekend = DB.C<PlanningWeekendEntity>().FirstOrDefault(p => p.PortalUser_id == UserIdObj);
					cities.ForEach(c => c.selected = weekend.Cities.Contains(c.gid));
				}

				if (req.planningType.Value == PlanningType.Custom)
				{
					var customIdObj = new ObjectId(req.customId);

					var custom = DB.C<PlanningCustomEntity>().FirstOrDefault(p => p.PortalUser_id == UserIdObj);
					var selectedSearch = custom.Searches.FirstOrDefault(c => c.id == customIdObj);

					if (selectedSearch == null)
					{
						return new ObjectResult(null);
					}

					cities.ForEach(c => c.selected = selectedSearch.Cities.Contains(c.gid));
				}
			}

			return new ObjectResult(cities);
		}

		private AirportGroupResponse ToResponse(AirportGroupDO d)
		{
			var r = new AirportGroupResponse
			{
				city = d.City,
				countryCode = d.CountryCode,
				coord = d.Coord,
				gid = d.GID,
				population = d.Population
			};
			return r;
		}
	}

	public class AirportGroupResponse
	{
		public string city { get; set; }
		public string countryCode { get; set; }
		public int gid { get; set; }
		public LatLng coord { get; set; }
		public int population { get; set; }
		public bool selected { get; set; }
	}


}