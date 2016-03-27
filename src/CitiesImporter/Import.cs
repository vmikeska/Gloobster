using Gloobster.DomainObjects;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using Gloobster.Database;
using System.Linq;
using Gloobster.DomainModels.Wiki;
using Gloobster.Entities.Wiki;
using System;

namespace CitiesImporter
{
    public class Import
    {
        public static DbOperations DB;
        public static WikiArticleDomain ArticleDomain;
        
        private const string Lang = "en";

        public static List<CityDO> Cities = new List<CityDO>();
        public static List<CityDO> OrderedCities = new List<CityDO>();

        public static void LoadCities()
        {
            var path = @"C:\S\DBScripts\Cities1000us.json";
            using (var file = new StreamReader(path))
            {
                string line;
                int count = 0;

                while ((line = file.ReadLine()) != null)
                {
                    var trimLine = line.Trim();

                    if (string.IsNullOrEmpty(trimLine))
                    {
                        continue;
                    }

                    var cleanLine = trimLine.Substring(0, trimLine.Length - 1);
                    if (string.IsNullOrEmpty(cleanLine))
                    {
                        continue;
                    }

                    try
                    {
                        var city = JsonConvert.DeserializeObject<CityDO>(cleanLine);
                        Cities.Add(city);                        
                    }
                    catch
                    {

                    }
                }
            }

        }

        public static void SaveCities(int popTreshold, int lastProcessedGid)
        {
            DB = new DbOperations("mongodb://localhost:27017/Gloobster", "Gloobster");

            //DB = new DbOperations("mongodb://GloobsterConnector:Gloobster007@ds036178.mongolab.com:36178/Gloobster", "Gloobster"); 
            ArticleDomain = new WikiArticleDomain
            {
                DB = DB
            };

            OrderedCities = Cities.OrderBy(c => c.GID).ToList();

            foreach (var city in OrderedCities)
            {
                if (city.GID <= lastProcessedGid)
                {
                    continue;
                }

                if (city.Population < popTreshold)
                {
                    continue;
                }

                var dbCity = DB.C<WikiCityEntity>().FirstOrDefault(c => c.GID == city.GID);
                if (dbCity != null)
                {
                    continue;
                }
                
                ArticleDomain.CreateCity(city, Lang);
                Console.WriteLine($"Saved {city.Name} with GID: {city.GID}");
            }
        }
        
    }
}