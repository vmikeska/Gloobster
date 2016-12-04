using System;
using System.Collections.Generic;
using System.Globalization;
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
    public interface IQueriesDriver
    {
        List<FlightRequestDO> BuildRequests(string from, string to, PlaceType toPlaceType);
        Task DeleteConnection(string from, string to);
        object GetResultsOfFinishedQuery(List<FromToSE> fromTos);
        Task<ScoredFlightsDO> ProcessSearchResults(string toMapId, List<FlightSearchDO> weekSearches);
    }

    public class WeekendQueriesDriver: IQueriesDriver
    {
        public IFlightScoreEngine ScoreEngine { get; set; }
        public IDbOperations DB { get; set; }
        public IAirportsCache AirCache { get; set; }

        public List<FlightRequestDO> BuildRequests(string from, string to, PlaceType toPlaceType)
        {
            var dates = GetWeekendDateComibnations();
            var queries = new List<FlightRequestDO>();
            foreach (DateCombi date in dates)
            {
                var provQuery = new FlightRequestDO
                {
                    flyFrom = from,
                    to = to,
                    dateFrom = date.FromDate.ToString(),
                    dateTo = date.ToDate.ToString(),

                    //todo: rework then to something more specific
                    daysInDestinationFrom = "2",
                    daysInDestinationTo = "4",

                    Params = date
                };
                queries.Add(provQuery);
            }

            return queries;
        }

        public async Task DeleteConnection(string from, string to)
        {
            await DB.DeleteAsync<WeekendConnectionEntity>(c => (c.FromAirport == from) && (c.ToAirport == to));
        }

        public object GetResultsOfFinishedQuery(List<FromToSE> fromTos)
        {
            var conns = new List<WeekendConnectionEntity>();
            foreach (var fromTo in fromTos)
            {
                var conn = DB.FOD<WeekendConnectionEntity>(c => c.FromAirport == fromTo.From && c.ToAirport == fromTo.To);
                conns.Add(conn);
            }

            List<WeekendConnectionDO> connsDO = conns.Select(c => c.ToDO()).ToList();

            return connsDO;
        }

        public async Task<ScoredFlightsDO> ProcessSearchResults(string toMapId, List<FlightSearchDO> weekSearches)
        {
            //give score to flights
            var weekends = new List<WeekendConnectionEntity>();
            var allScoredFlights = new ScoredFlightsDO
            {
                Passed = new List<FlightDO>(),
                Discarded = new List<FlightDO>()
            };

            foreach (var weekSearch in weekSearches)
            {
                var prms = (DateCombi) weekSearch.Params;
                
                var scoredFlights = ScoreEngine.FilterFlightsByScore(weekSearch.Flights);                
                allScoredFlights.Passed.AddRange(scoredFlights.Passed);
                allScoredFlights.Discarded.AddRange(scoredFlights.Discarded);

                var flightsFromToGrouped = scoredFlights.Passed.GroupBy(g => new { g.From, g.To }).ToList();

                foreach (var gf in flightsFromToGrouped)
                {
                    string from = gf.Key.From;
                    string to = gf.Key.To;

                    var toAirport = AirCache.GetAirportByAirCode(to);
                    if (toAirport == null)
                    {
                        //todo: should not happen in future with complete airport DB, but what now, discard ?
                    }

                    List<FlightDO> flights = gf.ToList();

                    var weekend = GetOrCreateWeekend(weekends, from, to, toMapId, toAirport.GID, toAirport.Name, toAirport.CountryCode);
                    var weekGroup = new WeekendGroupSE
                    {
                        Flights = flights.Select(f => f.ToEntity()).ToList(),
                        Year = prms.Year,
                        WeekNo = prms.WeekNo,
                        FromPrice = flights.Select(p => p.Price).Min()
                    };
                    weekend.WeekFlights.Add(weekGroup);
                }
            }
            await DB.SaveManyAsync(weekends);

            return allScoredFlights;
        }
        
        private WeekendConnectionEntity GetOrCreateWeekend(List<WeekendConnectionEntity> items, string from, string to,
            string toMapId, int toCityId, string cityName, string countryCode)
        {
            var item = items.FirstOrDefault(i => i.FromAirport == from && i.ToAirport == to);
            bool exists = item != null;
            if (exists)
            {
                return item;
            }

            var weekend = new WeekendConnectionEntity
            {
                id = ObjectId.GenerateNewId(),
                FromAirport = from,
                ToAirport = to,
                ToMapId = toMapId,
                ToCityId = toCityId,
                CityName = cityName,
                CountryCode = countryCode,
                WeekFlights = new List<WeekendGroupSE>()
            };
            items.Add(weekend);
            return weekend;
        }

        private List<DateCombi> GetWeekendDateComibnations()
        {
            int countOfWeekends = 5;

            var today = DateTime.UtcNow;
            var now = today;
            var outDates = new List<DateCombi>();
            while (outDates.Count <= countOfWeekends)
            {
                now = now.AddDays(1);
                if (now.DayOfWeek == DayOfWeek.Thursday)
                {
                    var monday = now.AddDays(4);
                    var date = new DateCombi
                    {
                        FromDate = new Date(now.Day, now.Month, now.Year),
                        ToDate = new Date(monday.Day, monday.Month, monday.Year),
                        WeekNo = DateTimeFormatInfo.CurrentInfo.Calendar.GetWeekOfYear(now, CalendarWeekRule.FirstDay, DayOfWeek.Monday),
                        Year = now.Year
                    };
                    outDates.Add(date);
                }
            }

            return outDates;
        }
        
    }
}