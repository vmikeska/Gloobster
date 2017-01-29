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
        public NewAdminController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }

        [AuthorizeWeb]
        public IActionResult Index()
        {
            var vm = CreateViewModelInstance<NewAdminViewModel>();            
            return View(vm);
        }
        
    }
    

}
