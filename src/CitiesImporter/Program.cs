using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModels.Wiki;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;

namespace CitiesImporter
{
    public class Program
    {
        //public static string ConStr = "mongodb://worker:72365e25-b9d5-4ac9-a7f5-e7a0358c353b@ds030339-a0.mlab.com:30339,ds030339-a1.mlab.com:30332/gloobster?replicaSet=rs-ds030339";
        //public static string DbName = "gloobster";

        //public static string ConStr = "mongodb://GloobsterConnec:Gloobster007@ds036178.mongolab.com:36178/Gloobster";
        //public static string DbName = "Gloobster";

        //public static string ConStr = "mongodb://localhost:27017/Gloobster";
        //public static string DbName = "Gloobster";

        private static string GetConStr(string platform)
        {
            if (platform == "loc")
            {
                return "mongodb://localhost:27017/Gloobster";
            }

            if (platform == "test")
            {
                return "mongodb://GloobsterConnec:Gloobster007@ds036178.mongolab.com:36178/Gloobster";
            }

            if (platform == "prod")
            {
                return "mongodb://worker:72365e25-b9d5-4ac9-a7f5-e7a0358c353b@ds030339-a0.mlab.com:30339,ds030339-a1.mlab.com:30332/gloobster?replicaSet=rs-ds030339";
            }

            throw new Exception("env");
        }

        private static string GetDbName(string platform)
        {
            if ((platform == "loc") || (platform == "test"))
            {
                return "Gloobster";
            }
            
            if (platform == "prod")
            {
                return "gloobster";
            }

            throw new Exception("env");
        }
        
    

        public static void Main(string[] args)
        {
            string command = "";
            string platform = "";

            InitPrices();

            if (args.Length == 0)
            {
                Console.Write("platform(loc,test,prod): ");
                platform = Console.ReadLine();
                Console.Write("command(perm,drop,basic,add): ");
                command = Console.ReadLine();                
            }
            else
            {
                platform = args[0];
                command = args[1];
            }

            var conStr = GetConStr(platform);
            var dbName = GetDbName(platform);

            var db = new DbOperations(conStr, dbName);
            
            if (command == "perm")
            {
                bool existsPerm = db.C<WikiPermissionEntity>().Any();
                if (!existsPerm)
                {                   
                    var users = db.List<UserEntity>(u => (u.Mail == "mikeska@gmail.com") || (u.Mail == "vmikeska@hotmail.com"));

                    var masterAdmins = users.Select(u => new WikiPermissionEntity
                    {
                        IsMasterAdmin = true,
                        IsSuperAdmin = false,
                        id = ObjectId.GenerateNewId(),
                        User_id = u.User_id,
                        Articles = new List<ObjectId>()
                    });
                    db.SaveManyAsync(masterAdmins);
                }
            }

            if (command == "drop")
            {
                Console.WriteLine("Droping");
                db.DropCollection<WikiCityEntity>();
                db.DropCollection<WikiCountryEntity>();
                db.DropCollection<WikiContinentEntity>();
                db.DropCollection<WikiTextsEntity>();
                db.DropCollection<WikiPermissionEntity>();
                db.DropCollection<WikiListValuesEntity>();
                db.DropCollection<WikiReportEntity>();
                db.DropCollection<WikiAdminTaskEntity>();
                db.DropCollection<WikiChangeEventEntity>();
                Console.WriteLine("Done");
            }

            if (command == "basic")
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

            if (command == "add")
            {
                Import.DB = new DbOperations(conStr, dbName);                

                try
                {
                    Import.LoadCities();
                }
                catch (Exception exc)
                {
                    Console.WriteLine("LoadCities exception: " +exc.Message);
                }

                try
                {
                    Import.SaveCities(10000, 0);
                }
                catch (Exception exc)
                {
                    Console.WriteLine("SaveCities exception: " + exc.Message);
                }

                ;
                Console.WriteLine("Done");
            }

            
            Console.ReadLine();
        }

        private static void InitPrices()
        {
            var rootPath = "";
            var beerPricesPath = Path.Combine(rootPath, "Prices", "BeerPrices.json");
            var pricesPath = Path.Combine(rootPath, "Prices", "OtherPrices.json");
            var beerText = File.ReadAllText(beerPricesPath);
            var pricesText = File.ReadAllText(pricesPath);
            DefaultPricer.Parse(beerText, pricesText);
        }
    }
}
