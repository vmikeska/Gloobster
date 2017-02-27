using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Airport;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.SearchEngine
{
	[Route("api/[controller]")]
	public class AirportRangeController : BaseApiController
	{		
		public IAirportService AirService {get; set; }
		public IGeoNamesService GeoNames { get; set; }

		public AirportRangeController(IGeoNamesService geoNames, IAirportService airportService, ILogger log, IDbOperations db) : base(log, db)
		{
			DB = db;
			AirService = airportService;
			GeoNames = geoNames;
		}

		[HttpDelete]
		[AuthorizeApi]
		public async Task<IActionResult> Delete(int id)
		{
			bool success = await AirService.RemoveAirportInRange(UserId, id);			
			return new ObjectResult(success);
		}

		[HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody] NewHomeAirportRequest req)
		{
			var airportsDO = await AirService.SaveAirportInRange(UserId, req.airportId);
			var airportRes = airportsDO.ToResponse();

			return new ObjectResult(airportRes);
		}

		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] AirportsInRangeRequest req)
		{
            var ua = DB.FOD<UserAirportsEntity>(u => u.User_id == UserIdObj);

		    var loc = ua.CurrentLocation;

			//no loc throw
			
			var curCity = await GeoNames.GetCityByIdAsync(loc.GeoNamesId);
			
			var airports = AirService.GetAirportsInRange(curCity.Coordinates, req.distance);
			var airportsDO = await AirService.SaveAirportsInRange(UserId, airports);

			var airportsResponse = airportsDO.Select(a => a.ToResponse());

			return new ObjectResult(airportsResponse);
		}

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get()
		{
		    var ua = DB.FOD<UserAirportsEntity>(u => u.User_id == UserIdObj);

		    if (ua == null)
		    {
                return new ObjectResult(new object[0]);
            }
            
			List<AirportSaveResponse> airportsResponse = ua.Airports.Select(a => a.ToResponse()).ToList();
			return new ObjectResult(airportsResponse);
		}


	}
}