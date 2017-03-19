using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using Autofac;
using Gloobster.Portal.ViewModels;

namespace Gloobster.Portal.Controllers.Portal
{
    public class AboutController : PortalBaseController
    {
        public AboutController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }

        public IActionResult Us()
        {
            var vm = CreateViewModelInstance<AboutViewModel>();
            vm.DefaultLangModuleName = "pageAbout";
            vm.LoadClientTexts();

            return View(vm);
        }

        public IActionResult TravelDeals()
        {
            var vm = CreateViewModelInstance<EmptyViewModel>();
            return View(vm);
        }

        public IActionResult TravelBuddy()
        {
            var vm = CreateViewModelInstance<EmptyViewModel>();
            return View(vm);
        }
        
        public IActionResult Wiki()
        {
            var vm = CreateViewModelInstance<EmptyViewModel>();
            return View(vm);
        }

        public IActionResult TravelMap()
        {
            var vm = CreateViewModelInstance<EmptyViewModel>();
            return View(vm);
        }

        public IActionResult TripOrganizer()
        {
            var vm = CreateViewModelInstance<EmptyViewModel>();
            return View(vm);
        }

    }
    

}
