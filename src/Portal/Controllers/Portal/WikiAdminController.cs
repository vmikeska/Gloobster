using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
    public class WikiAdminController : PortalBaseController
    {
        public IWikiAdminTasks AdminTasks { get; set; }

        public WikiAdminController(IWikiAdminTasks adminTasks, ILogger log,  IDbOperations db, IComponentContext cc) : base(log, db, cc)
        {
            AdminTasks = adminTasks;
        }
    
        [AuthorizeWeb]
	    public IActionResult List()
	    {
	        var vm = CreateViewModelInstance<AdminTasksViewModel>();
            
            vm.Tasks = AdminTasks.GetUnresolvedTasks(UserId);

            return View(vm);
		}
       

	}
}
