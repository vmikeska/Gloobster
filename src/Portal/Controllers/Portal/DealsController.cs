using System.Linq;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.SearchEngine;
using Gloobster.Portal.Controllers.Api.Deals;
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
        public IActionResult Home(DealsReq req)
		{
            var ua = DB.FOD<UserAirportsEntity>(u => u.User_id == UserIdObj);

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
        
		private string FormatCityStr(UserAirportsEntity ua)
		{            
			if (ua?.CurrentLocation == null)
			{
				return string.Empty;
			}

		    var city = ua.CurrentLocation;

			return $"{ city.City}, {city.CountryCode}";
		}

	}

    public enum DealsSearchType { Deals, Classic }

    public class DealsReq
    {
        public DealsSearchType type { get; set; }

        public string fc { get; set; }
        public DealsPlaceReturnType ft { get; set; }
        
        public string tc { get; set; }
        public DealsPlaceReturnType tt { get; set; }

        public string dep { get; set; }
        public int depFlex { get; set; }
        public bool depHome { get; set; }

        public string ret { get; set; }
        public int retFlex { get; set; }
        public bool retHome { get; set; }

        public int seats { get; set; }
        
        public bool oneway { get; set; }
    }
	

}