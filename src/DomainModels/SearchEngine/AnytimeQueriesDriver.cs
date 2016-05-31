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

        private DateTime GetFirstFriday()
        {
            var friday = DateTime.UtcNow;

            while (friday.DayOfWeek != DayOfWeek.Friday)
            {
                friday = friday.AddDays(1);
            }

            return friday;
        }

        public List<FlightRequestDO> GetRequests(string from, string to, PlaceType toPlaceType)
        {
            int weeksCnt = 1;

            var queries = new List<FlightRequestDO>();

            var friday = GetFirstFriday();
            
            for (int act = 1; act <= weeksCnt; act++)
            {
                //var friday2 = friday.AddDays(7);
                //var friday3 = friday2.AddDays(7);
                
                var w1 = CreateReq(from, to, friday, friday.AddDays(2), toPlaceType);
                queries.Add(w1);
                
                friday = friday.AddDays(7);
            }

            return queries;
        }

        private FlightRequestDO CreateReq(string from, string to, DateTime since1, DateTime since2, PlaceType toPlaceType)
        {
            if (toPlaceType == PlaceType.City)
            {
                //testing just country
                var provQuery = new FlightRequestDO
                {
                    flyFrom = from,
                    to = to,
                    dateFrom = since1.ToDate().ToString(),
                    dateTo = since2.ToDate().ToString(),                    
                    one_per_date = "1",

                    daysInDestinationFrom = "2",
                    daysInDestinationTo = "10"
                };
                return provQuery;
            }

            if (toPlaceType == PlaceType.Country)
            {
                //testing just country
                var provQuery = new FlightRequestDO
                {
                    flyFrom = from,
                    to = to,
                    dateFrom = since1.ToDate().ToString(),
                    dateTo = since2.ToDate().ToString(),
                    oneforcity = "1",
                    
                    daysInDestinationFrom = "2",
                    daysInDestinationTo = "10"
                };
                return provQuery;
            }

            return null;
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
                conns.Add(conn);
            }

            var connsDO = conns.Select(c => c.ToDO()).ToList();

            return connsDO;
        }

        public async Task<ScoredFlights> ProcessSearchResults(string toMapId, List<FlightSearchDO> searches)
        {            
            var connections = new List<AnytimeConnectionEntity>();
            
            List<FlightDO> allFlights = searches.SelectMany(f => f.Flights).ToList();

            var scoredFlights = FilterFlightsByScore(allFlights);
            
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
                    //todo: should not happen in future with complete airport DB, but what now, discard ?
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

        private ScoredFlights FilterFlightsByScore(List<FlightDO> allFlights)
        {
            var res = new ScoredFlights
            {
                Discarded = new List<FlightDO>(),
                Passed = new List<FlightDO>()
            };

            foreach (var f in allFlights)
            {
                double? score = ScoreEngine.EvaluateFlight(f);

                if (!score.HasValue)
                {
                    res.Discarded.Add(f);
                    continue;
                }

                f.FlightScore = score.Value;
                if (score >= 0.5)
                {
                    res.Passed.Add(f);
                }
                else
                {
                    res.Discarded.Add(f);
                }
            }

            return res;
        }
    }
}