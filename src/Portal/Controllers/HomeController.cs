using Gloobster.Common;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
//using System.Security.Claims;
//using System.Web.Security;
//using Microsoft.AspNet.Authentication.Cookies;
//using Microsoft.AspNet.Http;

//using System.Security.Claims;
//using Microsoft.AspNet.Builder;
//using Microsoft.AspNet.Http;
//using Microsoft.AspNet.Http.Authentication;
//using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Security.Cookies;
//using Microsoft.Owin;

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
