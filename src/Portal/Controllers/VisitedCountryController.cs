using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.WebApiObjects;
using Microsoft.AspNet.Mvc;
using MongoDB.Driver.Linq;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class VisitedCountryController : Controller
	{
		public IVisitedCountriesDomain VisitedCountries;
		public ICountryService CountryService;

		public VisitedCountryController(IVisitedCountriesDomain visitedCountries, ICountryService countryService)
		{
			VisitedCountries = visitedCountries;
			CountryService = countryService;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(string userId)
		{
			var visitedCountriesDO = await VisitedCountries.GetVisitedCountriesByUserId(userId);

			var countryCodes2 = visitedCountriesDO.Select(c => c.CountryCode2).ToArray();
			var countries = countryCodes2.Select(c => CountryService.GetCountryByCountryCode2(c)).ToList();

			var response = new VisitedCountryResponse
			{
				Countries2 = countryCodes2,
				Countries3 = countries.Select(c => c.IsoAlpha3).ToArray()
			};

			return new ObjectResult(response);
		}
	}
}