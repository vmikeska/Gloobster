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
	public class DestinationController : PortalBaseController
	{
        public IPlanningDomain PlanningDom { get; set; }

        public DestinationController(IPlanningDomain planning, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
		{
            PlanningDom = planning;
        }

	    public IActionResult Chat()
	    {
            var vm = CreateViewModelInstance<ViewModelSkypickerChat>();

            return View(vm);
        }

        [CreateAccount]
        public IActionResult Planning()
		{
            //temp remove then
            PlanningDom.CreateDBStructure(UserId);

            var viewModel = CreateViewModelInstance<ViewModelPlanning>();
			viewModel.InitCurrentLocation = FormatCityStr(User.CurrentLocation);
            viewModel.CurrentLocation = User.CurrentLocation;

			if (User.HomeAirports != null)
			{
				var airportIds = User.HomeAirports.Select(a => a.OrigId);
				viewModel.Airports = DB.List<AirportEntity>(a => airportIds.Contains(a.OrigId));
			}

			return View(viewModel);
		}

		private string FormatCityStr(CityLocationSE city)
		{
			if (city == null)
			{
				return string.Empty;
			}

			return $"{city.City}, {city.CountryCode}";
		}

	}

	

}