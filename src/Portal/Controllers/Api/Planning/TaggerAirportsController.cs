using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Airport;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Planning
{
	[Route("api/[controller]")]
	public class TaggerAirportsController : BaseApiController
	{				
		
		public TaggerAirportsController(ILogger log, IDbOperations db) : base(log, db)
		{			
			DB = db;	
		}


		[HttpGet]
		[Authorize]
		public IActionResult Get(AirportTaggerRequest req)
		{
			if (string.IsNullOrEmpty(req.query))
			{
				req.query = string.Empty;
			}

			var q = req.query.ToLower();

			var airports = DB.C<AirportEntity>()
				.Where(a =>
						a.Name.ToLower().Contains(q) ||
						a.City.ToLower().Contains(q) ||
						a.IataFaa.ToLower().Contains(req.query) ||
						a.Icao.ToLower().Contains(req.query)
						)
				.Take(10)
				.ToList();

			var airportsResponse = airports.Select(a => new AirportTaggerResponse
			{
				text = $"{a.Name}({a.City},{a.CountryCode}),{a.IataFaa}",
				kind = "airport",
				value = a.OrigId.ToString()
			});

			return new ObjectResult(airportsResponse);
		}		
	}	
}