using Gloobster.Common;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using Gloobster.Common.DbEntity;
using TweetSharp;

namespace Gloobster.Portal.Controllers
{
    public class HomeController : Controller
    {
		public HomeController(IDbOperations db)
		{
			DB = db;
		}


		public IDbOperations DB;

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

	    [Authorize]
	    public IActionResult PinBoard(string userId)
	    {
			var pinBoardViewModel = new PinBoardViewModel(DB);
			pinBoardViewModel.Initialize(userId);

			return View(pinBoardViewModel);
		}
    }

	public class PinBoardViewModel
	{
		public PinBoardViewModel(IDbOperations db)
		{ 
			DB = db;
		}


		public IDbOperations DB;

		public void Initialize(string userId)
		{
			CalculateCities(userId);
		}


		public async void CalculateCities(string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			long countriesCount = await DB.GetCountAsync<VisitedCountryEntity>();
			Countries = (int)countriesCount;



		}


		public int Cities { get; set; }
		public int Countries { get; set; }
		public int WorldTraveled { get; set; }
		public int Badges { get; set; }
		public int TotalDistanceTraveled { get; set; }
	}
}
