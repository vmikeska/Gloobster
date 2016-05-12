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
        public IFlightsForUser UserFlights { get; set; }


        public SearchFlightsController(IFlightsForUser userFlights, IFlightsDatabase flightsDb, ILogger log, IDbOperations db) : base(log, db)
        {
            FlightsDb = flightsDb;
            UserFlights = userFlights;
        }
        
        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get()
        {
            //type = anytime/weekend/custom

            //if (type == weekend) {
            var flightSearchList = UserFlights.GetUserWeekendOffers(UserId);
            //}

            var flights = flightSearchList.SelectMany(f => f.Flights);

            return new ObjectResult(flights);
        }
        
        public IActionResult GetAytimeTesting(string type)
        {
            var anytime = DB.FOD<PlanningAnytimeEntity>(u => u.User_id == UserIdObj);

            var cities = DB.List<NewAirportCityEntity>(e => anytime.Cities.Contains(e.GID));
            var citiesGids = cities.Select(c => c.GID).ToList();

            //var citiesIds = cities.Select(c => $"{c.SpId}_{c.CountryCode.ToLower()}");

            var airports = DB.List<NewAirportEntity>(c => citiesGids.Contains(c.GID)).ToList();
            var airportCodes = airports.Select(c => c.Code).ToList();

            var toIds = string.Join(",", airportCodes);

            var query = new FlightQueryDO
            {
                FromPlace = "FRA",
                ToPlace = toIds,
                FromDate = new Date(1, 6, 2016),
                ToDate = new Date(8, 6, 2016)
            };

            var flights = FlightsDb.GetFlights(query);



            return new ObjectResult(flights);
        }

    }
}