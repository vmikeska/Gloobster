using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Api.Geo;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.PinBoard;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{
    [Route("api/[controller]")]
	public class VisitedCityController : BaseApiController
	{

		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCitiesDomain VisitedCities { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }

		public ICountryService CountryService { get; set; }

        public IPinBoardStats PinBoardStats { get; set; }

        public VisitedCityController(IPinBoardStats pinBoardStats,  ILogger log, IDbOperations db) : base(log, db)
		{
            PinBoardStats = pinBoardStats;
        }


		[HttpDelete]
		[AuthorizeApi]
		public async Task<IActionResult> Delete(int gid)
		{
            var resp = new RemovedCityResponse
            {
                gid = gid,
                countryCode = null
            };

            var visited = DB.FOD<VisitedEntity>(v => v.User_id == UserIdObj);

		    var city = visited.Cities.FirstOrDefault(c => c.GeoNamesId == gid);

            var f1 = DB.F<VisitedEntity>().Eq(c => c.User_id, UserIdObj);
            var u1 = DB.U<VisitedEntity>().Pull(c => c.Cities, city);
            var resCity = await DB.UpdateAsync(f1, u1);

            visited.Cities.RemoveAll(c => c.GeoNamesId == gid);
            bool stillSomeCitiesInCountry = visited.Cities.Any(c => c.CountryCode == city.CountryCode);
		    if (!stillSomeCitiesInCountry)
		    {
		        var country = visited.Countries.FirstOrDefault(c => c.CountryCode2 == city.CountryCode);
                var f2 = DB.F<VisitedEntity>().Eq(c => c.User_id, UserIdObj);
                var u2 = DB.U<VisitedEntity>().Pull(c => c.Countries, country);
                var resCountry = await DB.UpdateAsync(f2, u2);

		        resp.countryCode = city.CountryCode;
		    }

            var responser = new PinsResponser
            {
                PinBoardStats = PinBoardStats
            };

            PinBoardStatResponse stats = await responser.Create(UserId);
		    resp.stats = stats;

            return new ObjectResult(resp);
		}
        
    }

    public class RemovedCityResponse
    {
        public int gid { get; set; }
        public string countryCode { get; set; }
        public PinBoardStatResponse stats { get; set; }
    }
}