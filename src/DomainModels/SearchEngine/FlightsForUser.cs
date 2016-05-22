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
        
        public List<WeekendSearchResultDO> QuerySinglePlaces(List<RequeryDO> queries)
        {
            InitDB();
            
            var allResults = new List<WeekendSearchResultDO>();
            
            foreach (RequeryDO query in queries)
            {
                if (query.Type == FlightCacheRecordType.City)
                {
                    int gid = int.Parse(query.To);
                    WeekendSearchResultDO searchResult = QueryCity(query.From, gid);
                    allResults.Add(searchResult);
                }

                if (query.Type == FlightCacheRecordType.Country)
                {                    
                    WeekendSearchResultDO searchResult = QueryCountry(query.From, query.To);
                    allResults.Add(searchResult);
                }                
            }

            return allResults;
        }

        public List<WeekendSearchResultDO> QueryNewQueries(PlacesDO query)
        {
            InitDB();
            
            //var places = PlacesToQuery(offers);            
            var homeAirports = HomeAirports();
            
            var cities = new List<int>();
            var countries = new List<string>();

            if (query.EntireQuery)
            {
                var userIdObj = new ObjectId(query.UserId);
                var weekend = DB.FOD<PlanningWeekendEntity>(u => u.User_id == userIdObj);
                cities = weekend.Cities;
                countries = weekend.CountryCodes;
            }
            else
            {
                cities = query.Cities;
                countries = query.Countries;
            }
            

            var allResults = new List<WeekendSearchResultDO>();
            foreach (var homeAirport in homeAirports)
            {
                foreach (int gid in cities)
                {
                    WeekendSearchResultDO searchResult = QueryCity(homeAirport, gid);
                    allResults.Add(searchResult);
                }
                
                foreach (string countryCode in countries)
                {
                    WeekendSearchResultDO searchResult = QueryCountry(homeAirport, countryCode);
                    allResults.Add(searchResult);
                }
            }

            return allResults;
        }

        private void InitDB()
        {
            if (Cities == null)
            {
                Cities = DB.List<NewAirportCityEntity>();
            }
        }

        private WeekendSearchResultDO QueryCity(string from, int gid)
        {
            var dbCity = Cities.FirstOrDefault(c => c.GID == gid);
            if (string.IsNullOrEmpty(dbCity?.SpId))
            {
                return null;
            }

            var query = new FlightWeekendQueryDO
            {
                FromPlace = from,
                Id = dbCity.SpId,
                MapId = gid.ToString(),
                Type = FlightCacheRecordType.City
            };

            var searchResult = FlightsDB.GetQueryResults(query);
            return searchResult;
        }

        private WeekendSearchResultDO QueryCountry(string from, string countryCode)
        {            
            var query = new FlightWeekendQueryDO
            {
                FromPlace = from,
                Id = countryCode,
                MapId = countryCode,
                Type = FlightCacheRecordType.Country
            };

            var searchResult = FlightsDB.GetQueryResults(query);
            return searchResult;
        }

        //private Places PlacesToQuery(OffersDO offers)
        //{
        //    var cities = new List<int>();
        //    var countries = new List<string>();

        //    if (offers.Included != null)
        //    {
        //        if (offers.Included.GIDs != null)
        //        {
        //            cities = offers.Included.GIDs;
        //        }

        //        if (offers.Included.CountryCodes != null)
        //        {
        //            countries = offers.Included.CountryCodes;
        //        }

        //        if (cities.Any() || countries.Any())
        //        {
        //            return new Places
        //            {
        //                Cities = cities,
        //                Countries = countries
        //            };
        //        }
        //    }

        //    var userIdObj = new ObjectId(offers.UserId);
        //    var weekend = DB.FOD<PlanningWeekendEntity>(u => u.User_id == userIdObj);

        //    cities = weekend.Cities;
        //    countries = weekend.CountryCodes;

        //    bool countriesToExclude = (offers.Excluded?.CountryCodes != null);
        //    if (countriesToExclude)
        //    {
        //        var ccs = offers.Excluded?.CountryCodes;
        //        countries = countries.Where(c => !ccs.Contains(c)).ToList();
        //    }

        //    bool citiesToExclude = (offers.Excluded?.GIDs != null);
        //    if (citiesToExclude)
        //    {
        //        var cs = offers.Excluded?.GIDs;
        //        cities = cities.Where(c => !cs.Contains(c)).ToList();
        //    }
            
        //    return new Places
        //    {
        //        Cities = cities,
        //        Countries = countries
        //    };
            

        //    //todo: implement removing cities when entire country is selected            
        //}

        

        

        private List<string> HomeAirports()
        {
            return new List<string> { "FRA" };
        }

    }

    public class Places
    {
        public List<int> Cities { get; set; }
        public List<string> Countries { get; set; }
    }
}