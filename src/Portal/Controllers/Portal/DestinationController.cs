using System.Linq;
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
		public DestinationController(ILogger log, IDbOperations db) : base(log, db)
		{
			
		}

		public IActionResult Planning()
		{
			var portalUser = DB.C<UserEntity>().First(p => p.id == UserIdObj);

			var viewModel = CreateViewModelInstance<ViewModelPlanning>();
			viewModel.InitCurrentLocation = FormatCityStr(portalUser.CurrentLocation);
            viewModel.CurrentLocation = portalUser.CurrentLocation;

			if (portalUser.HomeAirports != null)
			{
				var airportIds = portalUser.HomeAirports.Select(a => a.OrigId);
				viewModel.Airports = DB.C<AirportEntity>().Where(a => airportIds.Contains(a.OrigId)).ToList();
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