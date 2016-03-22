using System.Collections.Generic;
using Gloobster.DomainObjects;
using Gloobster.Mappers;
using Gloobster.ReqRes.CitiesService;
using Microsoft.AspNet.Mvc;
using System.Linq;

namespace Gloobster.CitiesService.Controllers
{
    [Route("api/[controller]")]
    public class CityController : Controller
    {
		public ICitiesDB CDB { get; set; }


		public CityController(ICitiesDB citiesDB)
		{
			CDB = citiesDB;
		}


		[HttpGet("id/{id}")]
		public CityResponse Get(int id)
        {
	        CityDO city = CDB.GetCityById(id);
	        var cityR = city.ToResponse();

			return cityR;
        }

        [HttpGet("name/{cityName}/cc/{countryCode}/r/{maxRows}")]
	    public List<CityResponse> GetCityByName(string cityName, string countryCode, int maxRows)
	    {
		    var cities = CDB.FindCity(cityName, countryCode, maxRows);
			return cities.Select(c => c.ToResponse()).ToList();
		}

		[HttpGet("q/{query}/r/{maxRows}")]
		public List<CityResponse> GetCityQuery(string query, int maxRows)
		{
			var cities = CDB.QueryCities(query, maxRows);
			return cities.Select(c => c.ToResponse()).ToList();
		}
        
    }
}
