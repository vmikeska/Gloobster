using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Gloobster.ReqRes.MoveOut;
using Gloobster.ReqRes.PinBoard;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Geo
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
			
			var checkedDO = await CheckinDomain.CheckinPlace(place.SourceId, sourceType, UserId);

			var response = new PinBoardStatResponse();

			if (checkedDO.Countries != null)
			{				
				response.visitedCountries = checkedDO.Countries.Select(c => c.ToResponse()).ToArray();				
			}

			if (checkedDO.Cities != null)
			{
				response.visitedCities = checkedDO.Cities.Select(c => c.ToResponse()).ToArray();
			}

			if (checkedDO.Places != null)
			{
				response.visitedPlaces = checkedDO.Places.Select(c => c.ToResponse()).ToArray();				
			}

			var visited = DB.C<VisitedEntity>().FirstOrDefault(v => v.PortalUser_id == UserIdObj);
			response.citiesCount = visited.Cities.Count;
			response.countriesCount = visited.Countries.Count;
			response.worldTraveledPercent = PinBoardUtils.CalculatePercentOfWorldTraveled(visited.Countries.Count);			

			return new ObjectResult(response);
		}

		
	}
}