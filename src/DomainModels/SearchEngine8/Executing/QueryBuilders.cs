﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8.Executing
{
    public class AnytimeKiwiQueryBuilder : IQueryBuilder
    {
        public INewAirportCityCache NewAirCityCache { get; set; }

        //todo: should be reviewed at all
        public FlightRequestDO BuildCity(string airCode, int gid)
        {
            var today = DateTime.UtcNow;            
            var inHalfYear = today.AddMonths(6);

            var cityAir = NewAirCityCache.GetByGID(gid);
            if (cityAir == null)
            {
                return null;
            }

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = cityAir.SpId,
                dateFrom = today.ToDate().ToString(),
                dateTo = inHalfYear.ToDate().ToString(),
                one_per_date = "1",
                
                daysInDestinationFrom = "2",
                daysInDestinationTo = "10"
            };

            return req;
        }
        
        public FlightRequestDO BuildCountry(string airCode, string cc)
        {
            var today = DateTime.UtcNow;            
            var inHalfYear = today.AddMonths(6);

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = cc,
                dateFrom = today.ToDate().ToString(),
                dateTo = inHalfYear.ToDate().ToString(),
                oneforcity = "1",

                daysInDestinationFrom = "2",
                daysInDestinationTo = "10"
                //typeFlight = "round"
            };
            return req;
        }

    }

    public class WeekendKiwiQueryBuilder : IQueryBuilder
    {
        public INewAirportCityCache NewAirCityCache { get; set; }

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

            var cityAir = NewAirCityCache.GetByGID(gid);
            if (cityAir == null)
            {
                return null;
            }

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = cityAir.SpId,
                dateFrom = dates.FromDate.ToString(),
                dateTo = dates.ToDate.ToString(),

                daysInDestinationFrom = "2",
                daysInDestinationTo = "4"
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
                daysInDestinationTo = "4"
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

    public class CustomKiwiQueryBuilder : IQueryBuilder
    {
        public INewAirportCityCache NewAirCityCache { get; set; }
        public IDbOperations DB { get; set; }

        private string _userId;
        private string _customId;

        public CustomKiwiQueryBuilder(string userId, string customId)
        {
            _userId = userId;
            _customId = customId;
        }

        public FlightRequestDO BuildCity(string airCode, int gid)
        {
            var search = GetSearch();

            var cityAir = NewAirCityCache.GetByGID(gid);
            if (cityAir == null)
            {
                return null;
            }

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = cityAir.SpId,

                dateFrom = search.Deparature.ToString(),
                dateTo = search.Arrival.ToString(),

                daysInDestinationFrom = search.DaysFrom.ToString(),
                daysInDestinationTo = search.DaysTo.ToString()
            };

            return req;
        }

        public FlightRequestDO BuildCountry(string airCode, string cc)
        {
            var search = GetSearch();

            var req = new FlightRequestDO
            {
                flyFrom = airCode,
                to = cc,

                dateFrom = search.Deparature.ToString(),
                dateTo = search.Arrival.ToString(),

                daysInDestinationFrom = search.DaysFrom.ToString(),
                daysInDestinationTo = search.DaysTo.ToString()
            };

            return req;
        }

        private CustomSearchSE GetSearch()
        {
            //maybe cache these results somehow ?
            var userIdObj = new ObjectId(_userId);
            var customIdObj = new ObjectId(_customId);

            var custom = DB.FOD<DealsCustomEntity>(e => e.User_id == userIdObj);
            var search = custom.Searches.FirstOrDefault(s => s.id == customIdObj);
            return search;
        }

    }
}
