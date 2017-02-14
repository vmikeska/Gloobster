using System.Linq;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
	public class DealsController : PortalBaseController
	{
        public IPlanningDomain PlanningDom { get; set; }
        public ICustomSearchDomain CustomSearchDomain { get; set; }

        public DealsController(ICustomSearchDomain customSearchDomain, IPlanningDomain planning, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
		{
            PlanningDom = planning;
		    CustomSearchDomain = customSearchDomain;
		}

	    public IActionResult Chat()
	    {
            var vm = CreateViewModelInstance<ViewModelSkypickerChat>();

            return View(vm);
        }

        [CreateAccount]
        public IActionResult Home()
		{
            var ua = DB.FOD<UserAirports>(u => u.User_id == UserIdObj);

            //temp remove then
            PlanningDom.CreateDBStructure(UserId);
            CustomSearchDomain.CreateDbStructure(UserId);

            var vm = CreateViewModelInstance<ViewModelDeals>();

            vm.DefaultLangModuleName = "pageDeals";
            vm.LoadClientTexts(new[] { "jsDeals" });
            vm.InitCurrentLocation = FormatCityStr(ua);

            vm.HasAirports = false;
		    vm.HasCity = false;

            if (ua != null)
			{
                vm.CurrentLocation = ua.CurrentLocation;

			    vm.HasCity = ua.CurrentLocation != null;

                var airportIds = ua.Airports.Select(a => a.OrigId);
                vm.Airports = DB.List<AirportEntity>(a => airportIds.Contains(a.OrigId));

			    if (airportIds.Any())
			    {
                    vm.HasAirports = true;                    
			    }
			}

			return View(vm);
		}

		private string FormatCityStr(UserAirports ua)
		{            
			if (ua?.CurrentLocation == null)
			{
				return string.Empty;
			}

		    var city = ua.CurrentLocation;

			return $"{ city.City}, {city.CountryCode}";
		}

	}

	

}