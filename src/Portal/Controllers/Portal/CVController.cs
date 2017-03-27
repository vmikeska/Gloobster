using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using Autofac;
using Gloobster.Portal.ViewModels;

namespace Gloobster.Portal.Controllers.Portal
{
    public class CVController : PortalBaseController
    {
        public CVController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }

        public IActionResult CV()
        {
            var vm = CreateViewModelInstance<EmptyViewModel>();
            //vm.DefaultLangModuleName = "pageAbout";
            vm.LoadClientTexts();

            return View(vm);
        }
        
    }
    

}
