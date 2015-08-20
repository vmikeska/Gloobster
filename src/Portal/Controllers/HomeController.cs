


using Gloobster.Common;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System;

namespace Gloobster.Portal.Controllers
{
    public class HomeController : Controller
    {
        public HomeController(IDbOperations db)
        {
            DB = db;
        }


        public IDbOperations DB;

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
        

        public IActionResult Map()
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
