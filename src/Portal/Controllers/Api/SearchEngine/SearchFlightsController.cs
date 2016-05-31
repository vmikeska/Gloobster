using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Entities.Planning;
using Gloobster.Enums.SearchEngine;
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
        public IActionResult Get(SearchRequest req)
        {
            List<SearchResultDO> flightSearchList = new List<SearchResultDO>();
            
            bool isNewQuery = req.p == null && req.q == null;
            if (isNewQuery)
            {
                var pl = new PlacesDO
                {
                    UserId = UserId,
                    EntireQuery = true
                };

                flightSearchList = UserFlights.QueryNewQueries(pl, req.tt);
            }
            bool newPlacesAdded = (req.p != null && req.p.Any());
            if (newPlacesAdded)
            {
                var places = req.p.Select(i =>
                {
                    var prms = i.Split('-');
                    return new RequeryDO
                    {                        
                        To = prms[0],
                        Type = (PlaceType)Enum.Parse(typeof(PlaceType), prms[1])
                    };
                }).ToList();
                
                var pl = new PlacesDO
                {
                    UserId = UserId,
                    EntireQuery = false,
                    Countries = places.Where(p => p.Type == PlaceType.Country).Select(s => s.To).ToList(),
                    Cities = places.Where(p => p.Type == PlaceType.City).Select(s => int.Parse(s.To)).ToList()
                };

                flightSearchList = UserFlights.QueryNewQueries(pl, req.tt);
            }
            bool requerying = (req.q != null && req.q.Any());
            if (requerying)
            {
                var queries = req.q.Select(i =>
                {
                    var prms = i.Split('-');
                    return new RequeryDO
                    {
                        From = prms[0],
                        To = prms[1],
                        Type = (PlaceType) Enum.Parse(typeof (PlaceType), prms[2])
                    };
                }).ToList();

                flightSearchList = UserFlights.CheckStartedQueries(queries, req.tt);
            }
            
            return new ObjectResult(flightSearchList);
            
        }
        
        public IActionResult GetAytimeTesting(string type)
        {
            return new ObjectResult(null);

            //var anytime = DB.FOD<PlanningAnytimeEntity>(u => u.User_id == UserIdObj);

            //var cities = DB.List<NewAirportCityEntity>(e => anytime.Cities.Contains(e.GID));
            //var citiesGids = cities.Select(c => c.GID).ToList();

            ////var citiesIds = cities.Select(c => $"{c.SpId}_{c.CountryCode.ToLower()}");

            //var airports = DB.List<NewAirportEntity>(c => citiesGids.Contains(c.GID)).ToList();
            //var airportCodes = airports.Select(c => c.Code).ToList();

            //var toIds = string.Join(",", airportCodes);

            //var query = new FlightQueryDO
            //{
            //    FromPlace = "FRA",
            //    ToPlace = toIds,
            //    FromDate = new Date(1, 6, 2016),
            //    ToDate = new Date(8, 6, 2016)
            //};

            //var flights = FlightsDb.GetFlights(query);



            //return new ObjectResult(flights);
        }

    }

    public class SearchRequest
    {
        public TimeType tt { get; set; }

        //q=from-to-type
        public List<string> q { get; set; }

        //p=to-type
        public List<string> p { get; set; }        
    }    
}