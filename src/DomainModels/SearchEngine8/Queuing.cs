using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
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
    public class ClientRequestExecutor
    {
        public IDbOperations DB { get; set; }
        public RequestsBuilder8 ReqBuilder { get; set; }

        public FlightsDb8 FlightsDB { get; set; }

        public async Task<List<FlightQueryResult8DO>> ExeFirstRequestAsync(string userId, TimeType8 timeType, string customId = null)
        {
            var userIdObj = new ObjectId(userId);
            
            var dests = GetDestinations(timeType, userIdObj, customId);
            var queries = GetQueries(timeType, dests, userId, customId);
            
            var results = await ExeQueriesAsync(queries);
            return results;
        }

        public async Task<List<FlightQueryResult8DO>> ExeSingleRequestsAsync(string userId, TimeType8 timeType, DestinationRequests8DO dests, string customId = null)
        {
            var queries = GetQueries(timeType, dests, userId, customId);

            var results = await ExeQueriesAsync(queries);
            return results;
        }

        public List<FlightQueryResult8DO> ExeRequery(List<string> ids)
        {
            var results = FlightsDB.CheckOnResults(ids);
            return results;
        }


        private List<FlightQuery8DO> GetQueries(TimeType8 timeType, DestinationRequests8DO dests, string userId, string customId = null)
        {
            List<FlightQuery8DO> queries = null;

            if (timeType == TimeType8.Anytime)
            {                 
                queries = ReqBuilder.BuildQueriesAnytime(dests, userId);
            }

            if (timeType == TimeType8.Weekend)
            {                
                queries = ReqBuilder.BuildQueriesWeekend(dests, userId);
            }

            if (timeType == TimeType8.Custom)
            {             
                queries = ReqBuilder.BuildQueriesCustom(dests, userId, customId);
            }

            return queries;
        }

        private DestinationRequests8DO GetDestinations(TimeType8 timeType, ObjectId userIdObj, string customId)
        {
            DestinationRequests8DO dests = null;

            if (timeType == TimeType8.Anytime)
            {
                dests = GetDestinationsAnytime(userIdObj);                
            }

            if (timeType == TimeType8.Weekend)
            {
                dests = GetDestinationsWeekend(userIdObj);                
            }

            if (timeType == TimeType8.Custom)
            {
                var customObjId = new ObjectId(customId);
                dests = GetDestinationsCustom(userIdObj, customObjId);                
            }

            return dests;
        }

        private async Task<List<FlightQueryResult8DO>> ExeQueriesAsync(List<FlightQuery8DO> queries)
        {
            var results = new List<FlightQueryResult8DO>();
            foreach (var query in queries)
            {
                var result = await FlightsDB.GetResultsAsync(query);
                results.Add(result);
            }

            return results;
        }

        private DestinationRequests8DO GetDestinationsAnytime(ObjectId userIdObj)
        {
            var destinations = new DestinationRequests8DO();
            
            var ent = DB.FOD<PlanningAnytimeEntity>(u => u.User_id == userIdObj);
            destinations.GIDs = ent.Cities;
            destinations.CCs = ent.CountryCodes;
            
            return destinations;
        }
        
        private DestinationRequests8DO GetDestinationsWeekend(ObjectId userIdObj)
        {
            var destinations = new DestinationRequests8DO();
            
            var ent = DB.FOD<PlanningWeekendEntity>(u => u.User_id == userIdObj);
            destinations.GIDs = ent.Cities;
            destinations.CCs = ent.CountryCodes;
            
            return destinations;
        }

        private DestinationRequests8DO GetDestinationsCustom(ObjectId userIdObj, ObjectId customIdObj)
        {
            var destinations = new DestinationRequests8DO();

            var ent = DB.FOD<PlanningCustomEntity>(u => u.User_id == userIdObj);
            var search = ent.Searches.FirstOrDefault(s => s.id == customIdObj);

            destinations.GIDs = search.GIDs;
            destinations.CCs = search.CCs;

            return destinations;
        }
    }

    public class RequestsBuilder8
    {
        public IDbOperations DB { get; set; }
        public RequestBuilder8 ReqBuilder { get; set; }

        public List<FlightQuery8DO> BuildQueriesAnytime(DestinationRequests8DO destinations, string userId)
        {
            var queries = new List<FlightQuery8DO>();

            var airs = HomeAirports(userId);

            foreach (string air in airs)
            {
                foreach (string cc in destinations.CCs)
                {
                    var q = ReqBuilder.BuildQueryAnytimeCountry(air, cc);
                    queries.Add(q);
                }

                foreach (int gid in destinations.GIDs)
                {
                    var q = ReqBuilder.BuildQueryAnytimeCity(air, gid);
                    queries.Add(q);
                }                
            }

            return queries;
        }

        public List<FlightQuery8DO> BuildQueriesWeekend(DestinationRequests8DO destinations, string userId)
        {
            var queries = new List<FlightQuery8DO>();

            var airs = HomeAirports(userId);

            var weeks = GetWeekends(5);

            foreach (WeeksCombi week in weeks)
            {
                foreach (string air in airs)
                {
                    foreach (string cc in destinations.CCs)
                    {
                        var q = ReqBuilder.BuildQueryWeekendCountry(air, cc, week.WeekNo, week.Year);
                        queries.Add(q);
                    }

                    foreach (int gid in destinations.GIDs)
                    {
                        var q = ReqBuilder.BuildQueryWeekendCity(air, gid, week.WeekNo, week.Year);
                        queries.Add(q);
                    }
                }                
            }
            
            return queries;
        }

        public List<FlightQuery8DO> BuildQueriesCustom(DestinationRequests8DO destinations, string userId, string searchId)
        {
            var queries = new List<FlightQuery8DO>();
            
            var airs = HomeAirports(userId);

            foreach (string air in airs)
            {
                foreach (string cc in destinations.CCs)
                {
                    var q = ReqBuilder.BuildQueryCustomCountry(air, cc, userId, searchId);
                    queries.Add(q);
                }

                foreach (int gid in destinations.GIDs)
                {
                    var q = ReqBuilder.BuildQueryCustomCity(air, gid, userId, searchId);
                    queries.Add(q);
                }
            }
            
            return queries;
        }
        
        private List<WeeksCombi> GetWeekends(int countOfWeekends)
        {
            var weeks = new List<WeeksCombi>();

            var today = DateTime.UtcNow;
            int currentWeekNo = 
                DateTimeFormatInfo.CurrentInfo.Calendar.GetWeekOfYear(today, CalendarWeekRule.FirstFullWeek, DayOfWeek.Monday);


            int weekNo = currentWeekNo;
            int year = today.Year;

            for (int act = 1; act <= countOfWeekends; act++)
            {
                if (weekNo == 53)
                {
                    weekNo = 1;
                    year++;
                }

                weeks.Add(new WeeksCombi
                {
                    WeekNo = weekNo,
                    Year = year
                });

                weekNo++;
            }

            return weeks;
        }

        private List<string> HomeAirports(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var ua = DB.FOD<UserAirports>(u => u.User_id == userIdObj);

            var airIds = new List<int>();

            if (ua != null)
            {
                airIds = ua.Airports.Select(a => a.OrigId).ToList();
            }

            var airports = DB.List<AirportEntity>(a => airIds.Contains(a.OrigId));
            var codes = airports.Select(a => a.IataFaa).ToList();

            return codes;
        }
    }

    public class RequestBuilder8
    {
        public FlightQuery8DO BuildQueryAnytimeCity(string fromAir, int gid)
        {
            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = gid.ToString(),
                ToType = PlaceType8.City,
                TimeType = TimeType8.Anytime,
                Params = null
            };
        }

        public FlightQuery8DO BuildQueryAnytimeCountry(string fromAir, string cc)
        {
            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = cc,
                ToType = PlaceType8.Country,
                TimeType = TimeType8.Anytime,
                Params = null
            };
        }

        public FlightQuery8DO BuildQueryWeekendCity(string fromAir, int gid, int week, int year)
        {
            var prms = $"{week}_{year}";

            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = gid.ToString(),
                ToType = PlaceType8.City,
                TimeType = TimeType8.Weekend,
                Params = prms
            };
        }

        public FlightQuery8DO BuildQueryWeekendCountry(string fromAir, string cc, int week, int year)
        {
            var prms = $"{week}_{year}";

            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = cc,
                ToType = PlaceType8.Country,
                TimeType = TimeType8.Weekend,
                Params = prms
            };
        }

        public FlightQuery8DO BuildQueryCustomCity(string fromAir, int gid, string userId, string searchId)
        {
            var prms = $"{userId}_{searchId}";

            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = gid.ToString(),
                ToType = PlaceType8.City,
                TimeType = TimeType8.Custom,
                Params = prms
            };
        }

        public FlightQuery8DO BuildQueryCustomCountry(string fromAir, string cc, string userId, string searchId)
        {
            var prms = $"{userId}_{searchId}";

            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = cc,
                ToType = PlaceType8.Country,
                TimeType = TimeType8.Custom,
                Params = prms
            };
        }
    }

    public class FlightsDb8
    {
        public IDbOperations DB { get; set; }

        public async Task<FlightQueryResult8DO> GetResultsAsync(FlightQuery8DO q)
        {
            QueryEntity queryEntity = GetQuery(q);

            bool queryExists = queryEntity != null;
            if (queryExists)
            {
                if (queryEntity.State == QueryState8.Saved)
                {
                    return new FlightQueryResult8DO { QueryId = queryEntity.id.ToString(), State = QueryState8.Saved };
                }

                if (queryEntity.State == QueryState8.Started)
                {
                    return new FlightQueryResult8DO {QueryId = queryEntity.id.ToString(), State = QueryState8.Started};                    
                }

                if (queryEntity.State == QueryState8.Finished)
                {
                    return new FlightQueryResult8DO
                    {
                        QueryId = queryEntity.id.ToString(),
                        State = QueryState8.Finished,

                        //todo: return results
                        Result = new object()
                    };
                }
            }
            
            var newQueryId = await SaveQueryAsync(q);
            return new FlightQueryResult8DO {QueryId = newQueryId, State = QueryState8.Saved};
        }

        public List<FlightQueryResult8DO> CheckOnResults(List<string> ids)
        {
            var results = new List<FlightQueryResult8DO>();

            var objIds = ids.Select(i => new ObjectId(i)).ToList();

            var queries = DB.List<QueryEntity>(e => objIds.Contains(e.id));

            foreach (var query in queries)
            {
                if (query.State == QueryState8.Finished)
                {
                    //todo: get results
                }

                if (query.State == QueryState8.Started || query.State == QueryState8.Saved)
                {
                    var result = new FlightQueryResult8DO {QueryId = query.id.ToString(), State = query.State};
                    results.Add(result);
                }
            }

            return results;
        }

        private QueryEntity GetQuery(FlightQuery8DO q)
        {
            var ent = DB.FOD<QueryEntity>(e =>
                e.FromAir == q.FromAir &&
                e.To == q.To &&
                e.ToType == q.ToType &&
                e.TimeType == q.TimeType &&
                e.Params == q.Params);
            
            return ent;
        }

        private async Task<string> SaveQueryAsync(FlightQuery8DO q)
        {
            var id = ObjectId.GenerateNewId();

            var ent = new QueryEntity
            {
                id = id,
                FromAir = q.FromAir,
                To = q.To,
                ToType = q.ToType,
                TimeType = q.TimeType,
                Params = q.Params,
                State = QueryState8.Saved,
                Created = DateTime.UtcNow,
                Executed = null
            };

            await DB.SaveAsync(ent);

            return id.ToString();
        }
    }
  
}
