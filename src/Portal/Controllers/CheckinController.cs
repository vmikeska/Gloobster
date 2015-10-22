using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Facebook;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.WebApiObjects;
using Gloobster.WebApiObjects.PinBoard;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class CheckinController : Controller
	{
		public ICheckinPlaceDomain CheckinDomain { get; set; }
		public ICountryService CountryService { get; set; }

		public CheckinController(ICheckinPlaceDomain checkinDomain, ICountryService countryService)
		{
			CheckinDomain = checkinDomain;
			CountryService = countryService;
		}
		
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]CheckinRequest place, string userId)
		{
			var sourceType = (SourceType)place.SourceType;
			
			var checkedPlacesDO = await CheckinDomain.CheckinPlace(place.SourceId, sourceType, userId);

			var checkedPlacesResponse = new PinBoardStatResponse();

			if (checkedPlacesDO.Countries != null)
			{				
				checkedPlacesResponse.VisitedCountries = checkedPlacesDO.Countries.Select(c =>
				{
					var resp = c.ToResponse();
					resp.CountryCode3 = CountryService.GetCountryByCountryCode2(c.CountryCode2).IsoAlpha3;
					return resp;
				}).ToArray();				
			}

			if (checkedPlacesDO.Cities != null)
			{
				checkedPlacesResponse.VisitedCities = checkedPlacesDO.Cities.Select(c => c.ToResponse()).ToArray();
			}

			if (checkedPlacesDO.Places != null)
			{
				checkedPlacesResponse.VisitedPlaces = checkedPlacesDO.Places.Select(c => c.ToResponse()).ToArray();				
			}
			
			return new ObjectResult(checkedPlacesResponse);
		}		
	}
}