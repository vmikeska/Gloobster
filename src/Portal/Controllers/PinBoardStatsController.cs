using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.WebApiObjects;
using Gloobster.WebApiObjects.PinBoard;
using Microsoft.AspNet.Mvc;
using Gloobster.Mappers;

namespace Gloobster.Portal.Controllers
{
	public enum PluginType { MyPlacesVisited, MyFriendsVisited, MyFriendsDesired}

	public enum DisplayEntity { Pin, Heat, Countries}

	public class PinBoardStatRequest
	{
		public PluginType pluginType { get; set; }
		public DisplayEntity[] displayEntities { get; set; }

	}

	public class VisitedPlaceResponse2
	{
		public string UserId { get; set; }
		public VisitedPlaceRequest[] Places { get; set; }
	}

	
	[Route("api/[controller]")]
	public class PinBoardStatsController : Controller
	{

		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCitiesDomain VisitedCities { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }

		public ICountryService CountryService { get; set; }

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get([FromBody]PinBoardStatRequest request, string userId)
		{
			PinBoardStatResponse result = null;

			if (request.pluginType == PluginType.MyPlacesVisited)
			{
				result = await GetMyPlacesVisited(userId);
			}

			return new ObjectResult(result);
		}


		private async Task<PinBoardStatResponse> GetMyPlacesVisited(string userId)
		{
			var result = new PinBoardStatResponse();

			var visitedPlaces = await VisitedPlaces.GetPlacesByUserId(userId);
            result.VisitedPlaces = visitedPlaces.Select(p => p.ToResponse()).ToArray();

			var visitedCities = await VisitedCities.GetCitiesByUserId(userId);
			result.VisitedCities = visitedCities.Select(c => c.ToResponse()).ToArray();

			var visitedCountries = await VisitedCountries.GetVisitedCountriesByUserId(userId);
			var visitedCountriesResponse = visitedCountries.Select(c => c.ToResponse()).ToList();
			visitedCountriesResponse.ForEach(c => c.CountryCode3 = CountryService.GetCountryByCountryCode2(c.CountryCode2).IsoAlpha3);
			result.VisitedCountries = visitedCountriesResponse.ToArray();

			return result;
		}

	}
}