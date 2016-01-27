using System;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.DomainInterfaces;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
    public class HomeController : PortalBaseController
    {
		public IGeoNamesService GeoNames { get; set; }

		public HomeController(IGeoNamesService geoNames, ILogger log, IDbOperations db) : base(log, db)
		{
			GeoNames = geoNames;
		}

		public BsonDocument GenerateDoc()
        {
            return new BsonDocument
            {
                {"id", Guid.NewGuid().ToString()},
                {"name", "MyDoc" }
            };
        }

	    public IActionResult TripsList()
	    {
			return View();
		}

	    public IActionResult Index()
	    {
			return View();
        }

	    public IActionResult Test()
	    {
			var city = GeoNames.GetCityByIdAsync(1120483);

			return View();
	    }

        public IActionResult Test2()
        {
            var city = GeoNames.GetCityByIdAsync(1120483);

            return View();
        }


    }
}
