﻿using System;
using System.Threading.Tasks;
using System.Web;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers
{
    public class TwitterUserController : Controller
    {
	    public IMyTwitterService TwitterSvc { get; set; }	    
		public IDbOperations DB { get; set; }
		public IComponentContext ComponentContext { get; set; }
        public ILogger Log { get; set; }

		public TwitterUserController(ILogger log, IMyTwitterService twitterService, IDbOperations db, IComponentContext componentContext)
		{
			TwitterSvc = twitterService;			
			DB = db;
			ComponentContext = componentContext;
		    Log = log;
		}
        
	    public ActionResult Authorize()
	    {
		    Uri uri = TwitterSvc.BuildAuthorizationUri();
			
			return new RedirectResult(uri.ToString(), false);
		}
		
		public IActionResult AuthCallback(string oauth_token, string oauth_verifier)
		{			            
            var auth = TwitterSvc.VerifyCredintial(oauth_token, oauth_verifier);
            
            var response = new TwitterResponse
			{
				userId = auth.UserId,
				accessToken = auth.AccessToken,				
				tokenSecret = auth.TokenSecret				
			};
            
            return View(response);
		}        
	}

	public class TwitterResponse
	{		
		public string accessToken { get; set; }
		public string tokenSecret { get; set; }
		public string userId { get; set; }		
	}
}
