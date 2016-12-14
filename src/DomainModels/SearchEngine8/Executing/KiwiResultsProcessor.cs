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

            //this is so because of collection name recognition when saving to DB
            if (timeType == TimeType8.Anytime)
            {
                var saver = new KiwiAnytimeResultsSaver();
                var entities = saver.BuildEntities(outGroups, queryId);
                await DB.SaveManyAsync(entities);
            }

            if (timeType == TimeType8.Weekend)
            {
                var ps = ParamsParsers.Weekend(prms);
                var saver = new KiwiWeekendResultsSaver(ps.Week, ps.Year);
                var entities = saver.BuildEntities(outGroups, queryId);
                await DB.SaveManyAsync(entities);
            }

            if (timeType == TimeType8.Custom)
            {
                var ps = ParamsParsers.Custom(prms);
                var saver = new KiwiCustomResultsSaver(ps.UserId, ps.SearchId);
                var entities = saver.BuildEntities(outGroups, queryId);
                await DB.SaveManyAsync(entities);
            }
            
        }
    }
}