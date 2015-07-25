using System;
using Gloobster.Common.DbEntity;
using Goobster.Portal.Services;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Goobster.Portal.Controllers
{
    public class HomeController : Controller
    {
        public HomeController(IDbClass db)
        {
            DB = db;
        }


        public IDbClass DB;

        public BsonDocument GenerateDoc()
        {
            return new BsonDocument
            {
                {"id", Guid.NewGuid().ToString()},
                {"name", "MyDoc" }
            };
        }

        public IActionResult Index()
        {
           


            return View();
        }
        

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View("~/Views/Shared/Error.cshtml");
        }
    }
}
