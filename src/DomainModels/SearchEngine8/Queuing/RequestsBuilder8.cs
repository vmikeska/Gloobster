using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8.Queuing
{
    public class RequestsBuilder8: IRequestsBuilder8
    {
        public IDbOperations DB { get; set; }
        public IRequestBuilder8 ReqBuilder { get; set; }

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

    public class RequestBuilder8: IRequestBuilder8
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
            var prms = ParamsParsers.Weekend(week, year);

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
            var prms = ParamsParsers.Weekend(week, year);

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
            var prms = ParamsParsers.Custom(userId, searchId);

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
            var prms = ParamsParsers.Custom(userId, searchId);

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

}