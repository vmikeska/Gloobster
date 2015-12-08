using System;
using System.Threading.Tasks;
using System.Web;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
    public class TwitterUserController : Controller
    {
	    public IMyTwitterService TwitterSvc { get; set; }
	    public IUserService UserService { get; set; }
		public IDbOperations DB { get; set; }
		public IComponentContext ComponentContext { get; set; }

		public TwitterUserController(IMyTwitterService twitterService, IUserService userService, IDbOperations db, IComponentContext componentContext)
		{
			TwitterSvc = twitterService;
			UserService = userService;
			DB = db;
			ComponentContext = componentContext;
		}

	    public ActionResult MailStep()
	    {
		    return View();
	    }

	    public ActionResult Authorize(string mail)
	    {
		    Uri uri = TwitterSvc.BuildAuthorizationUri(mail);
			
			return new RedirectResult(uri.ToString(), false /*permanent*/);
		}
		
		public IActionResult AuthCallback(string mail, string oauth_token, string oauth_verifier)
		{			
			SocAuthenticationDO auth = TwitterSvc.VerifyCredintial(oauth_token, oauth_verifier);
			
			var response = new TwitterResponse
			{
				userId = auth.UserId,
				accessToken = auth.AccessToken,
				expiresAt = auth.ExpiresAt,
				mail = mail,
				tokenSecret = auth.TokenSecret				
			};

			return View(response);
		}

		
	}

	public class TwitterResponse
	{
		public string mail { get; set; }
		public string accessToken { get; set; }
		public string tokenSecret { get; set; }
		public string userId { get; set; }
		public DateTime expiresAt { get; set; }
	}
}
