﻿using System;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModels.Services.Twitter;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using Gloobster.WebApiObjects;
using Microsoft.AspNet.Mvc;
using TweetSharp;

namespace Gloobster.Portal.Controllers
{
    public class TwitterUserController : Controller
    {
	    public IMyTwitterService TwitterSvc { get; set; }
	    public IUserService UserService { get; set; }
		public IDbOperations DB { get; set; }

		public TwitterUserController(IMyTwitterService twitterService, IUserService userService, IDbOperations db)
		{
			TwitterSvc = twitterService;
			UserService = userService;
			DB = db;
		}

	    public ActionResult Authorize()
	    {
		    Uri uri = TwitterSvc.BuildAuthorizationUri();

			return new RedirectResult(uri.ToString(), false /*permanent*/);
		}
		
		public async Task<ActionResult> AuthCallback(string oauth_token, string oauth_verifier)
		{
			var auth = TwitterSvc.VerifyCredintial(oauth_token, oauth_verifier);
			
			var accountDriver = new TwitterAccountDriver {DB = DB};
			UserService.AccountDriver = accountDriver;

			var result = await UserService.Validate(auth);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString()
			};

			return View(response);
		}
	}
}
