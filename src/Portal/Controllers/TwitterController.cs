using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModels.Services.Twitter;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TweetSharp;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Gloobster.Portal.Controllers
{
    public class TwitterController : Controller
    {
	    public IMyTwitterService TwitterSvc;
		

		public TwitterController(IMyTwitterService twitterService)
		{
			TwitterSvc = twitterService;
		}

	    public ActionResult Authorize()
	    {
		    Uri uri = 
				TwitterSvc.BuildAuthorizationUri();
			return new RedirectResult(uri.ToString(), false /*permanent*/);
		}
		
		public ActionResult AuthCallback(string oauth_token, string oauth_verifier)
		{
			TwitterUser user = TwitterSvc.VerifyCredintial(oauth_token, oauth_verifier);
			
			var twitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
			
				
			
				//(GloobsterConfig.TwitterAccessToken, GloobsterConfig.TwitterAccessTokenSecret);

			var options = new ListTweetsOnUserTimelineOptions
			{
				ExcludeReplies = true,
				Count = 200,				
			};

			//var tweets = twitterSvc.ListTweetsOnHomeTimeline(options);

			var tweets = twitterSvc.ListTweetsOnUserTimeline(options);


			var userStr = JsonConvert.SerializeObject(user);
            return View();
		}
	}
}
