using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Airport;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.SearchEngine
{
    [Route("api/[controller]")]
    public class DealsCurrentLocationController : BaseApiController
    {
        public IAirportService AirService { get; set; }
        public IGeoNamesService GNS { get; set; }

        public DealsCurrentLocationController(IGeoNamesService gns, IAirportService airportService, ILogger log, IDbOperations db) : base(log, db)
        {
            DB = db;
            AirService = airportService;
            GNS = gns;
        }
        
        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] CurrentLocationReq req)
        {
            const int defaultDistance = 200;

            var location = await GetLocationSubEntity(req.gid);

            var ua = DB.FOD<UserAirports>(u => u.User_id == UserIdObj);

            bool firstInit = ua == null;
            if (firstInit)
            {
                var city = await GNS.GetCityByIdAsync(req.gid);

                var airports = AirService.GetAirportsInRange(city.Coordinates, defaultDistance);
                var airportsDO = await AirService.SaveAirportsInRange(UserId, airports);
            }
            
            var filter = DB.F<UserAirports>().Eq(p => p.User_id, UserIdObj);
            var update = DB.U<UserAirports>().Set(p => p.CurrentLocation, location);            
            var res = await DB.UpdateAsync(filter, update);

            return new ObjectResult(null);
        }

        private async Task<CityLocationSE> GetLocationSubEntity(int gid)
        {
            var city = await GNS.GetCityByIdAsync(gid);

            var location = new CityLocationSE
            {
                City = city.Name,
                CountryCode = city.CountryCode,
                GeoNamesId = city.GID
            };
            return location;
        }


    }

    public class CurrentLocationReq
    {
        public int gid { get; set; }
    }
}