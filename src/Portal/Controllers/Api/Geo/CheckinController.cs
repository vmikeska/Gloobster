using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.MoveOut;
using Gloobster.ReqRes.PinBoard;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api
{
	[Route("api/[controller]")]
	public class CheckinController : BaseApiController
	{
		public ICheckinPlaceDomain CheckinDomain { get; set; }
		public ICountryService CountryService { get; set; }

		public CheckinController(ICheckinPlaceDomain checkinDomain, ICountryService countryService, IDbOperations db) : base(db)
		{
			CheckinDomain = checkinDomain;
			CountryService = countryService;
		}
		
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]CheckinRequest place)
		{
			var sourceType = (SourceType)place.SourceType;
			
			var checkedPlacesDO = await CheckinDomain.CheckinPlace(place.SourceId, sourceType, UserId);

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