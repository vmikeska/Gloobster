using Gloobster.Common;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
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

        public IActionResult Index()
        {

			var twitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);

			var options = new ListTweetsOnUserTimelineOptions
			{
				ExcludeReplies = true,
				Count = 200,
				//UserId = 
			};

			var tweets = twitterSvc.ListTweetsOnUserTimeline(options);



			return View();
        }
        

        public IActionResult Map()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }
		
	}
}
