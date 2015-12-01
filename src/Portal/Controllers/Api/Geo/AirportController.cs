using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Airport;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Geo
{
	[Route("api/[controller]")]
	public class AirportController : BaseApiController
	{				
		public IDbOperations DB { get; set; }

		public AirportController(IDbOperations db) : base(db)
		{			
			DB = db;
		}

		[HttpGet]
		[Authorize]
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