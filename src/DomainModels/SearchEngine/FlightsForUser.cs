using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Entities.Planning;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine
{
    //todo: dont delete yet
    //public class GroupingEngine
    //{
    //    public GroupedFlight Group(ConnectionEntity connection)
    //    {
    //        return null;
    //        //connection.Flights
    //    }
    //}

    //public class GroupedFlight
    //{
    //    public string From;
    //    public string To;
    //    public int PriceFrom;
    //    public int PriceTo;
    //    public List<FlightSE> Flights;
    //}

    public class FlightsForUser : IFlightsForUser
    {
        public IDbOperations DB { get; set; }        
        public IFlightsDatabase FlightsDB { get; set; }

        public static List<NewAirportCityEntity> Cities;
        
        public List<FlightSearchResultDO> GetUserWeekendOffers(string userId)
        {
            if (Cities == null)
            {
                Cities = DB.List<NewAirportCityEntity>();
            }

            var userIdObj = new ObjectId(userId);
            
            var weekend = DB.FOD<PlanningWeekendEntity>(u => u.User_id == userIdObj);
            
            var homeAirports = HomeAirports();
            
            var allResults = new List<FlightSearchResultDO>();
            foreach (var homeAirport in homeAirports)
            {
                foreach (int cityGid in weekend.Cities)
                {
                    var dbCity = Cities.FirstOrDefault(c => c.GID == cityGid);
                    if (string.IsNullOrEmpty(dbCity?.SpId))
                    {
                        continue;
                    }
                    
                    var query = new FlightWeekendQueryDO
                    {
                        FromPlace = homeAirport,
                        Id = dbCity.SpId,
                        Type = FlightCacheRecordType.City,
                        //FromDate = dateCombi.FromDate,
                        //ToDate = dateCombi.ToDate
                    };

                    var searchResult = FlightsDB.GetQueryResults(query);
                    allResults.Add(searchResult);
                }
            }
                    
                    //foreach (var country in weekend.CountryCodes)
                    //{
                    //    var query = new FlightRecordQueryDO
                    //    {
                    //        FromPlace = homeAirport,
                    //        Id = country,
                    //        Type = FlightCacheRecordType.Country,
                    //        FromDate = dateCombi.FromDate,
                    //        ToDate = dateCombi.ToDate
                    //    };

                    //    var flightSearchList = FlightsDB.GetFlights(query);                        
                    //    allFlights.AddRange(flightSearchList);
                    //}
                
            
            
            return allResults;            
        }

        

        private List<string> HomeAirports()
        {
            return new List<string> { "FRA" };
        }

    }
}