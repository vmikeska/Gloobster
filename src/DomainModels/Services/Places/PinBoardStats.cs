using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Places
{        
    public class PinBoardStats : IPinBoardStats
    {
        public IDbOperations DB { get; set; }
        public IVisitedEntityRequestor Visited { get; set; }

        public async Task<PinBoardStatsResultDO> GetStatsAsync(string userId)
        {            
            var visited = await Visited.GetOrCreate(userId);

            var res = Result(visited);
            return res;
        }

        private PinBoardStatsResultDO Result(VisitedEntity visited)
        {
            var allCities = visited.Cities.Select(c => c.GeoNamesId).ToList();

            var res = new PinBoardStatsResultDO
            {
                CitiesCount = visited.Cities.Count,
                CountriesCount = visited.Countries.Count,
                StatesCount = visited.States.Count,
                WorldTraveledPercent = PinBoardUtils.CalculatePercentOfWorldTraveled(visited.Countries.Count),

                AfricaCities = GetCities(allCities, StatCities.AfricaCities),
                AsiaCities = GetCities(allCities, StatCities.AsiaCities),
                EuropeCities = GetCities(allCities, StatCities.EuropeCities),
                NorthAmericaCities = GetCities(allCities, StatCities.NorthAmericaCities),
                SouthAmericaCities = GetCities(allCities, StatCities.SouthAmericaCities),
                AustraliaCities = GetCities(allCities, StatCities.AustraliaCities),

                CountryCodes = GetCountryCodes(visited.Countries),
                StateCodes = GetStateCodes(visited.States)
            };
            
            return res;
        }

        private List<string> GetStateCodes(List<VisitedStateSE> states)
        {
            return states.Select(c => c.StateCode).ToList();
        }

        private List<string> GetCountryCodes(List<VisitedCountrySE> countries)
        {
            return countries.Select(c => c.CountryCode2).ToList();
        }

        private List<int> GetCities(List<int> allCities, List<int> searchedCities)
        {
            var cities = allCities.Where(searchedCities.Contains).ToList();
            return cities;
        }
        
    }

    public class StatCities
    {
        public static List<int> EuropeCities =
            new List<int> { 2643743, 3128760, 2988507, 3169070, 3067696, 2759794, 2950159, 3054643, 745044 };

        public static List<int> AsiaCities =
            new List<int> { 1609350, 1850147, 292223, 1819729, 1835848, 1735161, 1880252, 1796236, 1668341 };

        public static List<int> NorthAmericaCities =
            new List<int> { 5128581, 4164138, 5368361, 4167147, 5391959, 5506956, 5856195, 4140963, 4887398 };

        public static List<int> SouthAmericaCities =
            new List<int> { 3530597, 3435910, 3448439, 3936456, 3621849, 3688689, 3441575, 3451190, 3871336 };

        public static List<int> AfricaCities =
            new List<int> { 993800, 3369157, 360630, 2553604, 2464470, 1007311, 2332459, 184745, 2306104 };

        public static List<int> AustraliaCities =
            new List<int> { 2147714, 2158177, 2063523, 2073124, 2165087, 2172517, 2172797, 2174003, 2078025 };        
    }


    public class PinBoardUtils
    {
        public static int CalculatePercentOfWorldTraveled(int countriesVisited)
        {
            float percent = (countriesVisited / 193.0f) * 100;
            return (int)percent;
        }
    }
}