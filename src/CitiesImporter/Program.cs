using System;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModels.Wiki;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;

namespace CitiesImporter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string input = "";

            if (args.Length == 0)
            {
                input = Console.ReadLine();
            }
            else
            {
                input = args[0];
            }
            
            var db = new DbOperations("mongodb://localhost:27017/Gloobster", "Gloobster");

            if (input == "drop")
            {
                Console.WriteLine("Droping");
                db.DropCollection<WikiCityEntity>();
                db.DropCollection<WikiCountryEntity>();
                db.DropCollection<WikiContinentEntity>();
                db.DropCollection<WikiTextsEntity>();
                db.DropCollection<WikiPermissionEntity>();
                db.DropCollection<WikiListValuesEntity>();
            }

            if (input == "basic")
            {
                Console.WriteLine("Creating");
                var creator = new InitialWikiDataCreator
                {
                    DB = db,
                    CountryService = new CountryService(),
                    GNService = new GeoNamesService(),
                    ArticleDomain = new WikiArticleDomain
                    {
                        DB = db,
                        LinkBuilder = new NiceLinkBuilder
                        {
                            DB = db
                        }
                    }

                };

                creator.CreateInitialData();
            }

            if (input == "add")
            {
                Import.LoadCities();
                Import.SaveCities(10000, 0);
            }

            Console.WriteLine("Done");
            Console.ReadLine();
        }
    }
}
