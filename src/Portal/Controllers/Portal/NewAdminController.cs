using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using Autofac;
using Gloobster.Portal.ViewModels;

namespace Gloobster.Portal.Controllers.Portal
{
    public class NewAdminController : PortalBaseController
    {
        public IWikiPermissions Perms { get; set; }

        public NewAdminController(IWikiPermissions perms, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            Perms = perms;
        }

        [AuthorizeWeb]
        public IActionResult Index()
        {
            var vm = CreateViewModelInstance<NewAdminViewModel>();

            vm.IsMasterAdmin = Perms.IsMasterAdmin(UserId);
            vm.IsSuperAdmin = Perms.IsSuperAdmin(UserId);
            vm.IsAdminOfSomething = Perms.IsAdminOfSomething(UserId);
            
            return View(vm);
        }
        
    }
    

}
