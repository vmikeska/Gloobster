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
			return View();
        }
        

        public IActionResult Map()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

		string _consumerKey = "0gvTaCaKc4acKcMh1m1ah4tR6";
		string _consumerSecret = "sQURat6s73ApQbuQplogDY5jLJ9JSo57xE6qfZ7b81itxmWqJj";

		//string _accessTokenSecret = "qEAUzZnbvdtFJj51gAO0szMVlzCeCHenPBLEp3RRsj3zC";
		//string _accessToken = "1228562882-DaM75urty2GqQmLZ0T2nBqJQ5CL7iZcxVPHszi0";

		public ActionResult Authorize()
		{
			// Step 1 - Retrieve an OAuth Request Token
			TwitterService service = new TwitterService(_consumerKey, _consumerSecret);

			// This is the registered callback URL
			OAuthRequestToken requestToken = service.GetRequestToken("http://localhost:9090/AuthorizeCallback");

			// Step 2 - Redirect to the OAuth Authorization URL
			Uri uri = service.GetAuthorizationUri(requestToken);
			return new RedirectResult(uri.ToString(), false /*permanent*/);
		}

		// This URL is registered as the application's callback at http://dev.twitter.com
		public ActionResult AuthorizeCallback(string oauth_token, string oauth_verifier)
		{
			var requestToken = new OAuthRequestToken { Token = oauth_token };

			// Step 3 - Exchange the Request Token for an Access Token
			TwitterService service = new TwitterService(_consumerKey, _consumerSecret);
			OAuthAccessToken accessToken = service.GetAccessToken(requestToken, oauth_verifier);

			// Step 4 - User authenticates using the Access Token
			service.AuthenticateWith(accessToken.Token, accessToken.TokenSecret);
			TwitterUser user = service.VerifyCredentials(new VerifyCredentialsOptions {IncludeEntities = true});
			var viewModel = string.Format("Your username is {0}", user.ScreenName);
			return View(viewModel);
		}

		//public IActionResult Contact()
		//{
		//    ViewData["Message"] = "Your contact page.";

		//    return View();
		//}

		//public IActionResult Error()
		//{
		//    return View("~/Views/Shared/Error.cshtml");
		//}
	}
}
