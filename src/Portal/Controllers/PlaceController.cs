using System.Threading.Tasks;
using Gloobster.DomainModels.Services.GeonamesService;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class PlaceController : Controller
	{
		public IGeoNamesService GeoNames;

		public PlaceController(IGeoNamesService geoNames)
		{
			GeoNames = geoNames;
		}

		[HttpGet]
		public async Task<IActionResult> Get(string placeName)
		{
			CitySearchResponse results = await GeoNames.GetCityQueryAsync(placeName, 30);

			return new ObjectResult(results.GeoNames);
		}		
	}
}