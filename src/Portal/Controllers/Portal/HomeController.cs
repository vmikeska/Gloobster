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
		public HomeController(IDbOperations db) : base(db)
		{
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
			


		 //   var creator = new AirportGroupCreator();
		 //   creator.DB = DB;
		 //creator.Execute();

			return View();
        }

	    public IActionResult Test()
	    {
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
