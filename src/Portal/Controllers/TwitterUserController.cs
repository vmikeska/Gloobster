using System;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModels.Services.Twitter;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using Gloobster.WebApiObjects;
using Microsoft.AspNet.Mvc;
using TweetSharp;

namespace Gloobster.Portal.Controllers
{
    public class TwitterUserController : Controller
    {
	    public IMyTwitterService TwitterSvc;
	    public IUserService UserService;
		
		public TwitterUserController(IMyTwitterService twitterService, IUserService userService)
		{
			TwitterSvc = twitterService;
			UserService = userService;
		}

	    public ActionResult Authorize()
	    {
		    Uri uri = TwitterSvc.BuildAuthorizationUri();

			return new RedirectResult(uri.ToString(), false /*permanent*/);
		}
		
		public async Task<ActionResult> AuthCallback(string oauth_token, string oauth_verifier)
		{
			TwitterUser user = TwitterSvc.VerifyCredintial(oauth_token, oauth_verifier);

			var userDO = user.ToDO();
			userDO.OauthToken = oauth_token;
			userDO.OauthVerifier = oauth_verifier;

			var accountDriver = new FacebookAccountDriver
			{
				DB = new DbOperations(),
				FBService = new FacebookService()
			};
			UserService.AccountDriver = accountDriver;

			var result = await UserService.Validate(userDO);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString()
			};

			return new ObjectResult(response);
		}
	}
}
