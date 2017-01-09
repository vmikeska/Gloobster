using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
    public class DashboardController : PortalBaseController
    {
        public ITripDomain TripDomain { get; set; }
        public IFacebookFriendsService FbFriendsSvc { get; set; }
        
        public DashboardController(IFacebookFriendsService fbFriendsSvc, ITripDomain tripDomain, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            TripDomain = tripDomain;
            FbFriendsSvc = fbFriendsSvc;
        }

        public async Task<IActionResult> Dashboard()
        {
            var vm = CreateViewModelInstance<ViewModelDashboard>();
            vm.DefaultLangModuleName = "pageDashboard";
            vm.LoadClientTexts(new[] { "jsDashboard" });

            await vm.Init(DB, UserId, TripDomain, FbFriendsSvc);

            return View(vm);
        }

        public IActionResult Calendar()
        {
            var vm = CreateViewModelInstance<ViewModelCalendar>();
            return View(vm);
        }

    }
}