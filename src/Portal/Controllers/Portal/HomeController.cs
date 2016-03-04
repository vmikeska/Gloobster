using System;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Wiki;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
    public class HomeController : PortalBaseController
    {
		public IInitialDataCreator DataCreator { get; set; }

		public HomeController(IInitialDataCreator dataCreator, ILogger log, IDbOperations db) : base(log, db)
		{
            DataCreator = dataCreator;
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
            DataCreator.CreateInitialData();


            return View();
	    }

        public IActionResult Test2()
        {
            
            return View();
        }


    }
}
