using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.IO;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.Entities.Trip;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Portal
{
	public class DestinationController : PortalBaseController
	{
		public DestinationController(IDbOperations db) : base(db)
		{
			
		}

		public IActionResult Planning()
		{
			var portalUser = DB.C<PortalUserEntity>().First(p => p.id == DBUserId);

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