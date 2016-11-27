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
    public class CitiesCountries
    {
        public List<int> Cities { get; set; }
        public List<string> Countries { get; set; }
    }

    public class FlightsForUser : IFlightsForUser
    {
        public IDbOperations DB { get; set; }        
        public IFlightsDatabase FlightsDB { get; set; }

        public static List<NewAirportCityEntity> Cities;
        
        public List<SearchResultDO> CheckStartedQueries(List<RequeryDO> queries, TimeType timeType)
        {
            InitDB();
            
            var allResults = new List<SearchResultDO>();
            
            foreach (RequeryDO query in queries)
            {
                if (query.Type == PlaceType.City)
                {
                    int gid = int.Parse(query.To);
                    SearchResultDO searchResult = QueryCity(query.From, gid, timeType);
                    allResults.Add(searchResult);
                }

                if (query.Type == PlaceType.Country)
                {                    
                    SearchResultDO searchResult = QueryCountry(query.From, query.To, timeType);
                    allResults.Add(searchResult);
                }                
            }

            return allResults;
        }
        
        public List<SearchResultDO> QueryNewQueries(PlacesDO query, TimeType timeType)
        {
            InitDB();
            
            var homeAirports = HomeAirports(query.UserId);
            
            var cities = new List<int>();
            var countries = new List<string>();

            if (query.EntireQuery)
            {
                var userIdObj = new ObjectId(query.UserId);
                var cc = GetUsersCitiesAndCountries(timeType, userIdObj);
                
                cities = cc.Cities;
                countries = cc.Countries;
            }
            else
            {
                cities = query.Cities;
                countries = query.Countries;
            }
            
            var allResults = new List<SearchResultDO>();
            foreach (var homeAirport in homeAirports)
            {
                foreach (int gid in cities)
                {
                    SearchResultDO searchResult = QueryCity(homeAirport, gid, timeType);
                    allResults.Add(searchResult);
                }
                
                foreach (string countryCode in countries)
                {
                    SearchResultDO searchResult = QueryCountry(homeAirport, countryCode, timeType);
                    allResults.Add(searchResult);
                }
            }

            return allResults;
        }

        private CitiesCountries GetUsersCitiesAndCountriesCustom(ObjectId userIdObj, ObjectId searchId)
        {
            var cc = new CitiesCountries();

            

            return cc;
        }

        private CitiesCountries GetUsersCitiesAndCountries(TimeType timeType, ObjectId userIdObj)
        {
            var cc = new CitiesCountries();

            if (timeType == TimeType.Anytime)
            {
                var weekend = DB.FOD<PlanningAnytimeEntity>(u => u.User_id == userIdObj);
                cc.Cities = weekend.Cities;
                cc.Countries = weekend.CountryCodes;
            }

            if (timeType == TimeType.Weekend)
            {
                var weekend = DB.FOD<PlanningWeekendEntity>(u => u.User_id == userIdObj);
                cc.Cities = weekend.Cities;
                cc.Countries = weekend.CountryCodes;
            }

            return cc;
        }

        private void InitDB()
        {
            if (Cities == null)
            {
                Cities = DB.List<NewAirportCityEntity>();
            }
        }

        private SearchResultDO QueryCity(string from, int gid, TimeType timeType)
        {
            var dbCity = Cities.FirstOrDefault(c => c.GID == gid);
            if (string.IsNullOrEmpty(dbCity?.SpId))
            {
                return null;
            }

            var query = new FlightDbQueryDO
            {
                FromPlace = from,
                Id = dbCity.SpId,
                MapId = gid.ToString(),
                ToType = PlaceType.City,
                TimeType = timeType
            };

            SearchResultDO searchResult = FlightsDB.GetQueryResults(query);
            return searchResult;
        }

        private SearchResultDO QueryCountry(string from, string countryCode, TimeType timeType)
        {            
            var query = new FlightDbQueryDO
            {
                FromPlace = from,
                Id = countryCode,
                MapId = countryCode,
                ToType = PlaceType.Country,
                TimeType = timeType
            };

            SearchResultDO searchResult = FlightsDB.GetQueryResults(query);
            return searchResult;
        }
        
        private List<string> HomeAirports(string userId)
        {
            var userIdObj = new ObjectId(userId);
            var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);
            var airIds = user.HomeAirports.Select(a => a.OrigId).ToList();
            var airports = DB.List<AirportEntity>(a => airIds.Contains(a.OrigId));
            var codes = airports.Select(a => a.IataFaa).ToList();

            return codes;            
        }
        
    }

    public class Places
    {
        public List<int> Cities { get; set; }
        public List<string> Countries { get; set; }
    }
}