using System;
using System.Threading.Tasks;
using System.Web;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.CommonEnums;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Portal.ReqRes;
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
		
		public async Task<ActionResult> AuthCallback(string mail, string oauth_token, string oauth_verifier)
		{			
			var auth = TwitterSvc.VerifyCredintial(oauth_token, oauth_verifier);

			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Twitter");
			UserService.AccountDriver = accountDriver;

			var addInfo = new TwitterUserAddtionalInfoDO
			{
				Mail = mail
			};

			var result = await UserService.Validate(auth, addInfo);
			Context.Session.SetString(PortalConstants.UserSessionId, result.UserId);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString(),
				networkType = SocialNetworkType.Twitter
			};

			return View(response);
		}
	}
}
