using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Geo
{
	[Route("api/[controller]")]
	public class AirportRangeController : BaseApiController
	{
		public IDbOperations DB { get; set; }
		public IAirportService AirService {get; set; }
		public IGeoNamesService GeoNames { get; set; }

		public AirportRangeController(IGeoNamesService geoNames, IAirportService airportService, IDbOperations db) : base(db)
		{
			DB = db;
			AirService = airportService;
			GeoNames = geoNames;
		}

		[HttpDelete]
		[Authorize]
		public async Task<IActionResult> Delete(int id)
		{
			bool success = await AirService.RemoveAirportInRange(UserId, id);			
			return new ObjectResult(success);
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody] NewHomeAirportRequest req)
		{
			var airportsDO = await AirService.SaveAirportInRange(UserId, req.airportId);
			var airportRes = airportsDO.ToResponse();

			return new ObjectResult(airportRes);
		}

		[HttpPut]
		[Authorize]
		public async Task<IActionResult> Put([FromBody] AirportsInRangeRequest req)
		{
			var loc = PortalUser.CurrentLocation;

			//todo: no loc throw
			
			var curCity = await GeoNames.GetCityByIdAsync(loc.GeoNamesId);
			//var coord = new LatLng {Lat = curCity.Coordinates.L, Lng = curLocation.Lng};
			
			var airports = AirService.GetAirportsInRange(curCity.Coordinates, req.distance);
			var airportsDO = await AirService.SaveAirportsInRange(UserId, airports);

			var airportsResponse = airportsDO.Select(a => a.ToResponse());

			return new ObjectResult(airportsResponse);
		}

		[HttpGet]
		[Authorize]
		public IActionResult Get()
		{
			if (PortalUser.HomeAirports == null)
			{
				return new ObjectResult(new object[0]);
			}

			var airportsResponse = PortalUser.HomeAirports.Select(a => a.ToResponse()).ToList();
			return new ObjectResult(airportsResponse);
		}


	}
	public class AirportsInRangeRequest
	{		
		public int distance { get; set; }
	}

	public class NewHomeAirportRequest
	{
		public string airportId { get; set; }
    }
}