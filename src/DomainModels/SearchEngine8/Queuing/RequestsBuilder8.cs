using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine8;
using Gloobster.Entities;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8.Queuing
{
    public class RequestsBuilder8: IRequestsBuilder8
    {
        public IDbOperations DB { get; set; }
        public IRequestBuilder8 ReqBuilder { get; set; }
        public IAirportCache AirCache { get; set; }

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

            if (!destinations.Any())
            {
                return queries;
            }

            var airs = GetCustomAirs(userId, searchId);
            
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

        private List<string> GetCustomAirs(string userId, string searchId)
        {
            var userIdObj = new ObjectId(userId);
            var sidObj = new ObjectId(searchId);
            var customEnt = DB.FOD<DealsCustomEntity>(p => p.User_id == userIdObj);
            var search = customEnt.Searches.FirstOrDefault(s => s.id == sidObj);

            var airs = new List<string>();
            if (search.StandardAirs)
            {
                var ha = HomeAirports(userId);
                airs.AddRange(ha);
            }

            if (search.CustomAirs != null)
            {
                var customIds = search.CustomAirs.Select(a => a.OrigId);

                foreach (int customId in customIds)
                {
                    var air = AirCache.GetByOrigId(customId);
                    airs.Add(air.IataFaa);
                }
            }

            return airs;
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

            var ua = DB.FOD<UserAirportsEntity>(u => u.User_id == userIdObj);

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

    public class RequestBuilder8: IRequestBuilder8
    {
        public FlightQuery8DO BuildQueryAnytimeCity(string fromAir, int gid)
        {
            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = gid.ToString(),
                ToType = PlaceType.City,
                TimeType = TimeType.Anytime,
                Params = null
            };
        }

        public FlightQuery8DO BuildQueryAnytimeCountry(string fromAir, string cc)
        {
            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = cc,
                ToType = PlaceType.Country,
                TimeType = TimeType.Anytime,
                Params = null
            };
        }

        public FlightQuery8DO BuildQueryWeekendCity(string fromAir, int gid, int week, int year)
        {
            var prms = ParamsParsers.Weekend(week, year);

            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = gid.ToString(),
                ToType = PlaceType.City,
                TimeType = TimeType.Weekend,
                Params = prms
            };
        }

        public FlightQuery8DO BuildQueryWeekendCountry(string fromAir, string cc, int week, int year)
        {
            var prms = ParamsParsers.Weekend(week, year);

            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = cc,
                ToType = PlaceType.Country,
                TimeType = TimeType.Weekend,
                Params = prms
            };
        }

        public FlightQuery8DO BuildQueryCustomCity(string fromAir, int gid, string userId, string searchId)
        {
            var prms = ParamsParsers.Custom(userId, searchId);

            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = gid.ToString(),
                ToType = PlaceType.City,
                TimeType = TimeType.Custom,
                Params = prms
            };
        }

        public FlightQuery8DO BuildQueryCustomCountry(string fromAir, string cc, string userId, string searchId)
        {
            var prms = ParamsParsers.Custom(userId, searchId);

            return new FlightQuery8DO
            {
                FromAir = fromAir,
                To = cc,
                ToType = PlaceType.Country,
                TimeType = TimeType.Custom,
                Params = prms
            };
        }
    }

}