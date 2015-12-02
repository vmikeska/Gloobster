using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Planning
{
	[Route("api/[controller]")]
	public class TaggerAirportsController : BaseApiController
	{				
		public IDbOperations DB { get; set; }
		
		public TaggerAirportsController(IDbOperations db) : base(db)
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

	public class AirportTaggerRequest
	{
		public string query { get; set; }	
	}

	public class AirportTaggerResponse
	{
		public string kind { get; set; }
		public string text { get; set; }
		public string value { get; set; }
	}
}