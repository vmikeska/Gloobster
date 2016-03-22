using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
    public class SiteMapController : PortalBaseController
    {
        public SiteMapController(ILogger log,  IDbOperations db) : base(log, db)
		{
        }
    
	    public async Task<IActionResult> Sitemap()
	    {
	        //PinBoardViewModel vm = CreateViewModelInstance<PinBoardViewModel>();
            
            
            //return View(vm);
	        return null;
	    }

	}

    public class SiteMap
    {
        //public 
    }

    public class SiteMapItem
    {
        
    }

}
