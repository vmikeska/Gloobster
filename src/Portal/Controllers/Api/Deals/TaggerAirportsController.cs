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
		[AuthorizeApi]
		public IActionResult Get(AirportTaggerRequest req)
		{
			if (string.IsNullOrEmpty(req.query))
			{
				req.query = string.Empty;
			}

			var q = req.query.ToLower();
            
            var airports = DB.C<AirportEntity>()
                .OrderByDescending(o => o.IncomingFlights)
                .Where(a => a.IataFaa.ToLower().StartsWith(q) || a.City.ToLower().Contains(q))                
                .Take(10)                
                .ToList();

            airports = airports.Where(a => !string.IsNullOrEmpty(a.IataFaa)).ToList();


            var airportsResponse = airports.Select(a => new AirportTaggerResponse
			{
				text = $"{a.City}, {a.CountryCode} - {a.IataFaa}",
				kind = "airport",
				value = a.OrigId.ToString()
			});

			return new ObjectResult(airportsResponse);
		}		
	}	
}