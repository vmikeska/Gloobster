using System;
using System.IO;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Hammock.Serialization;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Newtonsoft.Json;
using System.Windows;
using Gloobster.DomainInterfaces;

namespace Gloobster.Portal.Controllers.Portal
{
    public class HomeController : PortalBaseController
    {
		public IGeoNamesService GeoNames { get; set; }

		public HomeController(IGeoNamesService geoNames, IDbOperations db) : base(db)
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
		    


			//var creator = new AirportGroupCreator();
			//creator.DB = DB;
			//creator.Execute();

			return View();
        }

	    public IActionResult Test()
	    {
			var city = GeoNames.GetCityByIdAsync(1120483);

			return View();
	    }
	    
	    public IActionResult PinBoard()
	    {
			var pinBoardViewModel = CreateViewModelInstance<PinBoardViewModel>();			
			pinBoardViewModel.Initialize(UserId);
			
			return View(pinBoardViewModel);
		}

	    
    }
}
