using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using Autofac;
using Gloobster.Portal.ViewModels;

namespace Gloobster.Portal.Controllers.Portal
{
    public class LegalController : PortalBaseController
    {
        public LegalController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }

        public IActionResult TermsAndConds()
        {
            var vm = CreateViewModelInstance<EmptyViewModel>();            
            return View(vm);
        }

        public IActionResult PrivacyPolicy()
        {
            var vm = CreateViewModelInstance<EmptyViewModel>();
            return View(vm);
        }

    }
    

}
