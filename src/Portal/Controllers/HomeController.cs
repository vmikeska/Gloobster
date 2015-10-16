using Gloobster.Common;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common.CommonEnums;
using Gloobster.Common.DbEntity;
using Microsoft.AspNet.Http;
using TweetSharp;

namespace Gloobster.Portal.Controllers
{
    public class HomeController : Controller
    {
	    public string UserId
	    {
		    get
		    {
				var userIdSession = Context.Session.GetString(PortalConstants.UserSessionId);			    
			    return userIdSession;
		    }
	    }

	    //public bool IsUserLogged => !string.IsNullOrEmpty(UserId);s


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
	    
	    public IActionResult PinBoard()
	    {
			var pinBoardViewModel = new PinBoardViewModel(DB);
			pinBoardViewModel.Initialize(UserId);

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

		public async void Initialize(string userId)
		{
			bool isUserLogged = !string.IsNullOrEmpty(userId);
			if (!isUserLogged)
			{
				return;
			}
			
			Countries = await CalculateCountries(userId);
			Cities = await CalculatePlaces(userId);
			WorldTraveled = CalculatePercentOfWorldTraveled(Countries);
		}


		private async Task<int> CalculateCountries(string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			long countriesCount = await DB.GetCountAsync<VisitedCountryEntity>(query);
			return (int)countriesCount;			
		}

		private async Task<int> CalculatePlaces(string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			long placesCount = await DB.GetCountAsync<VisitedPlaceEntity>(query);
			return (int)placesCount;
		}

		private int CalculatePercentOfWorldTraveled(int countriesVisited)
		{
			float percent = (countriesVisited/193.0f) * 100;
			return (int) percent;
		}

		public int Cities { get; set; }
		public int Countries { get; set; }
		public int WorldTraveled { get; set; }
		public int Badges { get; set; }
		public int TotalDistanceTraveled { get; set; }
	}
}
