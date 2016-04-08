using System.Linq;
using Autofac;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
	public class DestinationController : PortalBaseController
	{
		public DestinationController(ILogger log, IDbOperations db, IComponentContext cc) : base(log, db, cc)
		{
			
		}

		public IActionResult Planning()
		{
			var portalUser = DB.FOD<UserEntity>(p => p.User_id == UserIdObj);

			var viewModel = CreateViewModelInstance<ViewModelPlanning>();
			viewModel.InitCurrentLocation = FormatCityStr(portalUser.CurrentLocation);
            viewModel.CurrentLocation = portalUser.CurrentLocation;

			if (portalUser.HomeAirports != null)
			{
				var airportIds = portalUser.HomeAirports.Select(a => a.OrigId);
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