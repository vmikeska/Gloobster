using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine
{
    
    public class AnytimeQueriesDriver : IQueriesDriver
    {
        public IFlightScoreEngine ScoreEngine { get; set; }
        public IDbOperations DB { get; set; }
        public IAirportsCache AirCache { get; set; }
        
        public List<FlightRequestDO> BuildRequests(string from, string to, PlaceType toPlaceType)
        {            
            var queries = new List<FlightRequestDO>();

            var today = DateTime.UtcNow;
            var inOneYear = today.AddYears(1);


            //todo: this is not done yet for city
            if (toPlaceType == PlaceType.City)
            {                
                var provQuery = new FlightRequestDO
                {
                    flyFrom = from,
                    to = to,
                    dateFrom = today.ToDate().ToString(),
                    dateTo = inOneYear.ToDate().ToString(),
                    one_per_date = "1",
                    typeFlight = "round",

                    daysInDestinationFrom = "2",
                    daysInDestinationTo = "10"
                };
                queries.Add(provQuery);
            }

            if (toPlaceType == PlaceType.Country)
            {
                //testing just country
                var provQuery = new FlightRequestDO
                {
                    flyFrom = from,
                    to = to,
                    dateFrom = today.ToDate().ToString(),
                    dateTo = inOneYear.ToDate().ToString(),
                    oneforcity = "1",
                    typeFlight = "round"                    
                };
                queries.Add(provQuery);
            }

            return queries;
        }

        public Task DeleteConnection(string from, string to)
        {
            return null;
        }

        public object GetResultsOfFinishedQuery(List<FromToSE> fromTos)
        {
            var conns = new List<AnytimeConnectionEntity>();
            foreach (var fromTo in fromTos)
            {
                var conn = DB.FOD<AnytimeConnectionEntity>(c => c.FromAirport == fromTo.From && c.ToAirport == fromTo.To);
                if (conn == null)
                {
                    continue;
                }

                conns.Add(conn);
            }

            var connsDO = conns.Select(c => c.ToDO()).ToList();
            
            return connsDO;
        }

        public async Task<ScoredFlightsDO> ProcessSearchResults(string toMapId, List<FlightSearchDO> searches)
        {
            var connections = new List<AnytimeConnectionEntity>();

            List<FlightDO> allFlights = searches.SelectMany(f => f.Flights).ToList();

            var scoredFlights = ScoreEngine.FilterFlightsByScore(allFlights);

            var flightsFromToGrouped = scoredFlights.Passed.GroupBy(g => new { g.From, g.To }).ToList();

            foreach (var gf in flightsFromToGrouped)
            {
                string from = gf.Key.From;
                string to = gf.Key.To;

                var flights = gf.ToList();
                double fromPrice = flights.Min(f => f.Price);

                var toAirport = AirCache.GetAirportByAirCode(to);
                if (toAirport == null)
                {
                    //todo: create complete database of 
                    continue;                    
                }
                
                var connection = new AnytimeConnectionEntity
                {
                    id = ObjectId.GenerateNewId(),
                    FromAirport = from,
                    ToAirport = to,
                    ToCityId = toAirport.GID,
                    CountryCode = toAirport.CountryCode,
                    Flights = flights.Select(f => f.ToEntity()).ToList(),
                    CityName = toAirport.Name,
                    FromPrice = fromPrice
                };

                connections.Add(connection);
            }

            await DB.SaveManyAsync(connections);

            return scoredFlights;
        }
        
        private DateTime GetFirstFriday()
        {
            var friday = DateTime.UtcNow;

            while (friday.DayOfWeek != DayOfWeek.Friday)
            {
                friday = friday.AddDays(1);
            }

            return friday;
        }
    }
}