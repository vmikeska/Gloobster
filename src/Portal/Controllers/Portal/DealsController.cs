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

            var viewModel = CreateViewModelInstance<ViewModelPlanning>();
			viewModel.InitCurrentLocation = FormatCityStr(ua);
            
            if (ua != null)
			{
                viewModel.CurrentLocation = ua.CurrentLocation;

                var airportIds = ua.Airports.Select(a => a.OrigId);
				viewModel.Airports = DB.List<AirportEntity>(a => airportIds.Contains(a.OrigId));
			}

			return View(viewModel);
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