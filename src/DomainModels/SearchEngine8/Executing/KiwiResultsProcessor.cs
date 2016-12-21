using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainModels.SearchEngine8.Executing
{
    public class KiwiResultsProcessor: IKiwiResultsProcessor
    {
        public IDbOperations DB { get; set; }
        public IFlightScoreEngine ScoreEngine { get; set; }
        public IFlightsBigDataCalculator BigDataCalculator { get; set; }
        public IAirportsCache AirCache { get; set; }
        
        public async Task ProcessFlightsAsync(List<FlightDO> flights, TimeType8 timeType, string queryId, string prms)
        {            
            ScoredFlightsDO evalFlights = ScoreEngine.FilterFlightsByScore(flights);

            BigDataCalculator.Process(evalFlights);

            var groupedFlights = evalFlights.Passed.GroupBy(g => new { g.From, g.To }).ToList();

            var outGroups = new List<GroupedResultDO>();

            foreach (var gf in groupedFlights)
            {
                string from = gf.Key.From;
                string to = gf.Key.To;

                var fs = gf.ToList();

                var toAirport = AirCache.GetAirportByAirCode(to);
                if (toAirport == null)
                {
                    //todo: create complete database of all airports
                    continue;
                }

                var outGroup = new GroupedResultDO
                {
                    From = from,
                    To = to,

                    CC = toAirport.CountryCode,
                    GID = toAirport.GID,
                    Name = toAirport.Name,

                    Flights = fs
                };
                outGroups.Add(outGroup);                
            }

            //temporary results count limiting for cities, have a look on method description
            ResultsLimiter(outGroups);

            await SaveResults(outGroups, timeType, queryId, prms);
        }

        /// <summary>
        /// This is temprary functionality. We need to limit results returned for a city. Usually houndreds, somethimes thousands.
        /// In future, we should aggregate these result and show average price to the user, or that there are many other similar
        /// offers possible
        /// </summary>
        /// <param name="inGroupedResults"></param>
        /// <returns></returns>
        private void ResultsLimiter(List<GroupedResultDO> inGroupedResults)
        {
            foreach (var groupedResult in inGroupedResults)
            {
                if (groupedResult.Flights.Count > 20)
                {
                    var topByPrice = groupedResult.Flights.OrderBy(o => o.Price).Take(10).ToList();
                    var topByScore = groupedResult.Flights.OrderByDescending(o => o.FlightScore).Take(10).ToList();

                    var filtered = new List<FlightDO>();
                    filtered.AddRange(topByPrice);
                    filtered.AddRange(topByScore);
                    filtered = filtered.Distinct().ToList();
                    groupedResult.Flights = filtered;
                }                
            }
        }

        private async Task SaveResults(List<GroupedResultDO> groupedResults, TimeType8 timeType, string queryId, string prms)
        {
            //this is so because of collection name recognition when saving to DB
            if (timeType == TimeType8.Anytime)
            {
                var saver = new KiwiAnytimeResultsSaver();
                var entities = saver.BuildEntities(groupedResults, queryId);
                await DB.SaveManyAsync(entities);
            }

            if (timeType == TimeType8.Weekend)
            {
                var ps = ParamsParsers.Weekend(prms);
                var saver = new KiwiWeekendResultsSaver(ps.Week, ps.Year);
                var entities = saver.BuildEntities(groupedResults, queryId);
                await DB.SaveManyAsync(entities);
            }

            if (timeType == TimeType8.Custom)
            {
                var ps = ParamsParsers.Custom(prms);
                var saver = new KiwiCustomResultsSaver(ps.UserId, ps.SearchId);
                var entities = saver.BuildEntities(groupedResults, queryId);
                await DB.SaveManyAsync(entities);
            }
        }
    }
}