using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.Planning;
using Gloobster.Enums.SearchEngine;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine
{
    public interface IFlightsForUser
    {
        List<FlightSearchDO> GetUserWeekendOffers(string userId);
    }

    public class FlightsForUser : IFlightsForUser
    {
        public IDbOperations DB { get; set; }
        public IFlightsDatabase FlightsDB { get; set; }
        
        public List<FlightSearchDO> GetUserWeekendOffers(string userId)
        {
            var userIdObj = new ObjectId(userId);
            
            var weekend = DB.FOD<PlanningWeekendEntity>(u => u.User_id == userIdObj);

            var dateCombinations = GetWeekendDateComibnations();
            var homeAirports = HomeAirports();

            var allFlights = new List<FlightSearchDO>();
            foreach (var homeAirport in homeAirports)
            {
                foreach (var dateCombi in dateCombinations)
                {
                    foreach (var city in weekend.Cities)
                    {
                        var query = new FlightRecordQueryDO
                        {
                            FromPlace = homeAirport,
                            Id = city.ToString(),
                            Type = FlightCacheRecordType.City,
                            FromDate = dateCombi.FromDate,
                            ToDate = dateCombi.ToDate
                        };

                        var flightSearchList = FlightsDB.GetFlights(query);
                        allFlights.AddRange(flightSearchList);
                    }

                    foreach (var country in weekend.CountryCodes)
                    {
                        var query = new FlightRecordQueryDO
                        {
                            FromPlace = homeAirport,
                            Id = country,
                            Type = FlightCacheRecordType.Country,
                            FromDate = dateCombi.FromDate,
                            ToDate = dateCombi.ToDate
                        };

                        var flightSearchList = FlightsDB.GetFlights(query);                        
                        allFlights.AddRange(flightSearchList);
                    }
                }
            }
            
            return allFlights;            
        }

        private List<DateCombi> GetWeekendDateComibnations()
        {
            int countOfWeekends = 10;

            var today = DateTime.UtcNow;
            var now = today;
            var outDates = new List<DateCombi>();
            while (outDates.Count <= countOfWeekends)
            {
                now = now.AddDays(1);
                if (now.DayOfWeek == DayOfWeek.Friday)
                {
                    var sunday = now.AddDays(2);
                    var date = new DateCombi
                    {
                        FromDate = new Date(now.Day, now.Month, now.Year),
                        ToDate = new Date(sunday.Day, sunday.Month, sunday.Year),
                    };
                    outDates.Add(date);
                }
            }

            return outDates;
        }

        private List<string> HomeAirports()
        {
            return new List<string> { "FRA", "PRG" };
        }

    }
}