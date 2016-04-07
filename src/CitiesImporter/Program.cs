using System;
using System.Collections.Generic;
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

            //var db = new DbOperations("mongodb://localhost:27017/Gloobster", "Gloobster");
            var db = new DbOperations("mongodb://GloobsterConnec:Gloobster007@ds036178.mongolab.com:36178/Gloobster", "Gloobster");

            if (input == "permissions")
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
                        User_id = u.id,
                        Articles = new List<ObjectId>()
                    });
                    db.SaveManyAsync(masterAdmins);
                }
            }

            if (input == "drop")
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
