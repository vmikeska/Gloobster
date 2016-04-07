using System;
using System.Threading.Tasks;
using System.Web;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers
{
    public class TwitterUserController : PortalBaseController
    {
	    public IMyTwitterService TwitterSvc { get; set; }	    				

        public TwitterUserController(IMyTwitterService twitterService, ILogger log, IDbOperations db) : base(log, db)
        {
            TwitterSvc = twitterService;
        }
        
        public ActionResult Authorize()
	    {
		    Uri uri = TwitterSvc.BuildAuthorizationUri();
			
			return new RedirectResult(uri.ToString(), false);
		}
		
		public IActionResult AuthCallback(string oauth_token, string oauth_verifier)
		{			
			var auth = TwitterSvc.VerifyCredintial(oauth_token, oauth_verifier);

		    var vm = CreateViewModelInstance<ViewModelTwitterAuthCallback>();
		    vm.UserId = auth.UserId;
		    vm.AccessToken = auth.AccessToken;
		    vm.TokenSecret = auth.TokenSecret;
		
			return View(vm);
		}

        
    }
}
