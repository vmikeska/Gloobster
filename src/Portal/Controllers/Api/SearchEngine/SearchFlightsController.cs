using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Entities.Planning;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Planning
{
    [Route("api/[controller]")]
    public class SearchFlightsController : BaseApiController
    {
        public IFlightsDatabase FlightsDb { get; set; }
        
        public SearchFlightsController(IFlightsDatabase flightsDb, ILogger log, IDbOperations db) : base(log, db)
        {
            FlightsDb = flightsDb;
        }
        
        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get()
        {
            var anytime = DB.FOD<PlanningAnytimeEntity>(u => u.User_id == UserIdObj);

            var cities = DB.List<AirportGroupEntity>(e => anytime.Cities.Contains(e.GID));
            var airportIds = cities.SelectMany(a => a.AirportIds).Distinct();

            var airports = DB.List<AirportEntity>(e => airportIds.Contains(e.GeoNamesId));

            foreach (var city in cities)
            {
                var toAirports = airports.Where(a => a.GeoNamesId == city.GID).ToList();

                foreach (var toAirport in toAirports)
                {
                    var query = new FlightQueryDO
                    {
                        FromPlace = "FRA",
                        ToPlace = toAirport.IataFaa,
                        FromDate = new Date(1,6,2016),
                        ToDate = new Date(8, 6, 2016)
                    };

                    var flights = FlightsDb.GetFlights(query);
                }
            }


            return new ObjectResult(null);
        }
        
    }
}