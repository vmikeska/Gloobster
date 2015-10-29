using System;
using Gloobster.Common;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

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
