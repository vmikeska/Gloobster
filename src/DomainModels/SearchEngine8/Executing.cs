using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Entities.Planning;
using Gloobster.Entities.SearchEngine;
using Gloobster.Mappers;
using Hammock;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8
{
    
    public class QueriesExecutor8
    {
        public IDbOperations DB { get; set; }
        public KiwiResultsExecutor KiwiExecutor { get; set; }
        public KiwiResultsProcessor ResultsProcessor { get; set; }

        private const int threadsCnt = 5;

        public async void ExecuteQueriesAsync()
        {
            await DeleteOldQueriesAsync();

            var queries = DB.C<QueryEntity>().Where(s => s.State == QueryState8.Saved).OrderBy(a => a.Created).ToList();

            foreach (var query in queries)
            {
                //? sync or async ?
                ExecuteQueryAsync(query);
            }
        }

        private async Task DeleteOldQueriesAsync()
        {
            DateTime old = DateTime.UtcNow.AddHours(-1);

            await DB.DeleteAsync<QueryEntity>(q => q.State == QueryState8.Finished && q.Executed.Value < old);
        }
        
        private async Task ExecuteQueryAsync(QueryEntity query)
        {            
            IQueryBuilder builder = GetBuilder(query);
            FlightRequestDO request = BuildRequest(query, builder);
            List<FlightDO> flights = KiwiExecutor.Search(request);

            await ResultsProcessor.ProcessFlightsAsync(flights, query.TimeType, query.id.ToString(), query.Params);
            
            await UpdateQueryStateAsync(query.id, QueryState8.Finished);
        }

        private async Task UpdateQueryStateAsync(ObjectId id, QueryState8 state)
        {
            var filter = DB.F<QueryEntity>().Eq(f => f.id, id);
            var update = DB.U<QueryEntity>().Set(u => u.State, state);

            await DB.UpdateAsync(filter, update);
        }

        private FlightRequestDO BuildRequest(QueryEntity query, IQueryBuilder builder)
        {
            FlightRequestDO request = null;

            if (query.ToType == PlaceType8.City)
            {
                int gid = int.Parse(query.To);
                request = builder.BuildCity(query.FromAir, gid);
            }

            if (query.ToType == PlaceType8.Country)
            {
                request = builder.BuildCountry(query.FromAir, query.To);
            }

            return request;
        }

        private IQueryBuilder GetBuilder(QueryEntity query)
        {
            IQueryBuilder builder = null;

            if (query.TimeType == TimeType8.Anytime)
            {
                builder = new AnytimeKiwiQueryBuilder();
            }

            if (query.TimeType == TimeType8.Weekend)
            {
                var pr = query.Params.Split('_');
                int week = int.Parse(pr[0]);
                int year = int.Parse(pr[1]);

                builder = new WeekendKiwiQueryBuilder(week, year);
            }

            if (query.TimeType == TimeType8.Custom)
            {
                //todo:
            }

            return builder;
        }
    }
    
    public class KiwiResultsExecutor
    {
        public const string BaseUrl = "https://api.skypicker.com/";
        public const string Endpoint = "flights";

        public List<FlightDO> Search(FlightRequestDO req)
        {
            var caller = new Calls();

            var qb = new QueryBuilder();
            qb
                .BaseUrl(BaseUrl)
                .Endpoint(Endpoint)

                .Param("partner", "picky")
                .Param("v", "3");


            foreach (var prop in req.GetType().GetProperties())
            {
                var value = prop.GetValue(req, null);
                if (value != null)
                {
                    var str = value.ToString();
                    if (!string.IsNullOrEmpty(str))
                    {
                        if (prop.Name == "Params")
                        {
                            continue;
                        }

                        qb.Param(prop.Name, str);

                    }
                }
            }

            var query = qb.Build();

            var result = caller.CallServer<SearchResultRoot>(query);
            if (result == null)
            {
                return null;
            }

            List<FlightDO> converted = result.data.Select(f => Convert(f)).ToList();
            
            return converted;
        }

        private FlightDO Convert(SPFlightSearchResult flight)
        {
            var flightParts = new List<FlightPartDO>();
            foreach (var route in flight.route)
            {
                var dTimeUtc = ConvertDate(route.dTimeUTC);
                var aTimeUtc = ConvertDate(route.aTimeUTC);
                TimeSpan duration = aTimeUtc - dTimeUtc;

                var flightPart = new FlightPartDO
                {
                    From = route.flyFrom,
                    To = route.flyTo,
                    DeparatureTime = ConvertDate(route.dTime),
                    ArrivalTime = ConvertDate(route.aTime),
                    Airline = route.airline,
                    MinsDuration = (int)duration.TotalMinutes,
                    FlightNo = route.flight_no
                };
                flightParts.Add(flightPart);
            }

            var res = new FlightDO
            {
                Price = flight.price,
                HoursDuration = GetDuration(flight.fly_duration),
                Connections = flight.route.Count,
                From = flight.flyFrom,
                To = flight.flyTo,
                FlightParts = flightParts
            };
            return res;
        }

        private DateTime ConvertDate(int seconds)
        {
            var date = new DateTime(1970, 1, 1);
            date = date.AddSeconds(seconds);
            return date;
        }

        private double GetDuration(string time)
        {
            var prms = time.Split(' ');
            double res = double.Parse(prms[0].Replace("h", ""));
            double mins = double.Parse(prms[1].Replace("m", ""));

            if (mins > 0)
            {
                res += (60 / mins);
            }
            return res;
        }
    }

    public class KiwiResultsProcessor
    {
        public IDbOperations DB { get; set; }
        public IFlightScoreEngine ScoreEngine { get; set; }
        public FlightsBigDataCalculator BigDataCalculator { get; set; }
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

            IKiwiResultSaver saver = GetSaver(timeType, prms);            
            var entities = saver.BuildEntities(outGroups, queryId);

            await DB.SaveManyAsync(entities);
        }

        private IKiwiResultSaver GetSaver(TimeType8 timeType, string prms)
        {
            IKiwiResultSaver saver = null;

            if (timeType == TimeType8.Anytime)
            {
                saver = new KiwiAnytimeResultsSaver();
            }

            if (timeType == TimeType8.Weekend)
            {
                var ps = ParamsParsers.Weekend(prms);
                saver = new KiwiWeekendResultsSaver(ps.Week, ps.Year);
            }

            if (timeType == TimeType8.Custom)
            {
                var ps = ParamsParsers.Custom(prms);
                saver = new KiwiCustomResultsSaver(ps.UserId, ps.SearchId);
            }

            return saver;
        }
    }
    
    public class KiwiAnytimeResultsSaver: IKiwiResultSaver
    {
        public List<EntityBase> BuildEntities(List<GroupedResultDO> groups, string queryId)
        {
            var qid = new ObjectId(queryId);

            var entities = new List<EntityBase>();

            foreach (var group in groups)
            {                                
                var flightsSE = group.Flights.Select(f => f.ToEntity()).ToList();

                var resEnt = new AnytimeResultsEntity
                {
                    id = ObjectId.GenerateNewId(),
                    Query_id = qid,

                    FromAir = group.From,
                    ToAir = group.To,

                    CC = group.CC,
                    GID = group.GID,
                    Name = group.Name,

                    Flights = flightsSE                    
                };
                
                entities.Add(resEnt);
            }

            return entities;
        }
    }

    public class KiwiWeekendResultsSaver : IKiwiResultSaver
    {
        private int _week;
        private int _year;

        public KiwiWeekendResultsSaver(int week, int year)
        {
            _week = week;
            _year = year;
        }

        public List<EntityBase> BuildEntities(List<GroupedResultDO> groups, string queryId)
        {
            var qid = new ObjectId(queryId);

            var entities = new List<EntityBase>();

            foreach (var group in groups)
            {
                var flightsSE = group.Flights.Select(f => f.ToEntity()).ToList();

                var resEnt = new WeekendResultsEntity
                {
                    id = ObjectId.GenerateNewId(),
                    Query_id = qid,

                    FromAir = group.From,
                    ToAir = group.To,

                    CC = group.CC,
                    GID = group.GID,
                    Name = group.Name,

                    Week = _week,
                    Year = _year,

                    Flights = flightsSE
                };

                entities.Add(resEnt);
            }

            return entities;
        }
    }

    public class KiwiCustomResultsSaver : IKiwiResultSaver
    {
        private string _customId;
        private string _userId;

        public KiwiCustomResultsSaver(string userId, string customId)
        {
            _customId = customId;
            _userId = userId;
        }

        public List<EntityBase> BuildEntities(List<GroupedResultDO> groups, string queryId)
        {
            var qid = new ObjectId(queryId);

            var entities = new List<EntityBase>();

            foreach (var group in groups)
            {
                var flightsSE = group.Flights.Select(f => f.ToEntity()).ToList();

                var resEnt = new CustomResultsEntity
                {
                    id = ObjectId.GenerateNewId(),
                    Query_id = qid,

                    FromAir = group.From,
                    ToAir = group.To,

                    CC = group.CC,
                    GID = group.GID,
                    Name = group.Name,

                    CustomId = _customId,
                    UserId = _userId,

                    Flights = flightsSE
                };

                entities.Add(resEnt);
            }

            return entities;
        }
    }

    public class AnytimeKiwiQueryBuilder: IQueryBuilder
    {
        //todo: should be reviewed at all
        public FlightRequestDO BuildCity(string airCode, int gid)
        {
            var today = DateTime.UtcNow;
            //todo: really one year ?
            var inOneYear = today.AddYears(1);

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = gid.ToString(),
                dateFrom = today.ToDate().ToString(),
                dateTo = inOneYear.ToDate().ToString(),
                one_per_date = "1",

                //todo: this is possibly not needed ?
                typeFlight = "round",

                daysInDestinationFrom = "2",
                daysInDestinationTo = "10"
            };

            return req;
        }

        public FlightRequestDO BuildCountry(string airCode, string cc)
        {
            var today = DateTime.UtcNow;
            //todo: really one year ?
            var inOneYear = today.AddYears(1);

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = cc,
                dateFrom = today.ToDate().ToString(),
                dateTo = inOneYear.ToDate().ToString(),
                oneforcity = "1",
                typeFlight = "round"
            };
            return req;
        }

    }
    
    public class WeekendKiwiQueryBuilder: IQueryBuilder
    {
        private int _week;
        private int _year;

        public WeekendKiwiQueryBuilder(int week, int year)
        {
            _week = week;
            _year = year;
        }
        
        public FlightRequestDO BuildCity(string airCode, int gid)
        {
            var dates = GetDates(_week, _year);

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = gid.ToString(),
                dateFrom = dates.FromDate.ToString(),
                dateTo = dates.ToDate.ToString(),

                daysInDestinationFrom = "2",
                daysInDestinationTo = "4",                
            };

            return req;
        }

        public FlightRequestDO BuildCountry(string airCode, string cc)
        {
            var dates = GetDates(_week, _year);

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = cc,
                dateFrom = dates.FromDate.ToString(),
                dateTo = dates.ToDate.ToString(),

                daysInDestinationFrom = "2",
                daysInDestinationTo = "4",
            };

            return req;
        }

        private DateRange GetDates(int week, int year)
        {
            DateTime start = FirstDateOfWeekISO8601(year, week);
            DateTime end = start.AddDays(4);

            return new DateRange
            {
                FromDate = start.ToDate(),
                ToDate = end.ToDate()
            };
        }

        //todo: check on this
        private DateTime FirstDateOfWeekISO8601(int year, int weekOfYear)
        {
            DateTime jan1 = new DateTime(year, 1, 1);
            int daysOffset = DayOfWeek.Thursday - jan1.DayOfWeek;

            DateTime firstThursday = jan1.AddDays(daysOffset);
            var cal = CultureInfo.CurrentCulture.Calendar;
            int firstWeek = cal.GetWeekOfYear(firstThursday, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);

            var weekNum = weekOfYear;
            if (firstWeek <= 1)
            {
                weekNum -= 1;
            }
            var result = firstThursday.AddDays(weekNum * 7);
            return result.AddDays(-3);
        }
    }

    public class FlightsBigDataCalculator
    {
        public void Process(ScoredFlightsDO evalFlights)
        {
            //todo: implement one day
        }
    }
}
