using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Airport;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Geo
{
	[Route("api/[controller]")]
	public class AirportController : BaseApiController
	{						
		public AirportController(ILogger log, IDbOperations db) : base(log, db)
		{			
			DB = db;
		}

		[HttpGet]
		[AuthorizeAttributeApi]
		public IActionResult Get(AirportRequest req)
		{
			if (string.IsNullOrEmpty(req.query))
			{
				return new ObjectResult(null);
			}

			var q = req.query.ToLower();

			var airports = DB.C<AirportEntity>()
				.Where(a =>
						a.Name.ToLower().Contains(q) ||
						a.City.ToLower().Contains(q) ||
						a.IataFaa.ToLower().Contains(req.query) ||
						a.Icao.ToLower().Contains(req.query)
						)
				.Take(req.limit)
				.ToList();

			var airportsResponse = airports.Select(a => a.ToResponse());

			return new ObjectResult(airportsResponse);
		}		
	}
	
}