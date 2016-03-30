using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModels.Wiki;
using Gloobster.Portal.ViewModels;
using Serilog;
using System.Linq;
using System.Web;
using Gloobster.Entities;
using Microsoft.AspNet.Http;

namespace Gloobster.Portal.Controllers.Portal
{
    public class HomeController : PortalBaseController
    {
		public IInitialWikiDataCreator DataCreator { get; set; }
        
        public HomeController(IInitialWikiDataCreator dataCreator, ILogger log, IDbOperations db) : base(log, db)
		{
            DataCreator = dataCreator;            
		}


        [CreateAccount]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        

        //public BsonDocument GenerateDoc()
        //{
        //    return new BsonDocument
        //    {
        //        {"id", Guid.NewGuid().ToString()},
        //        {"name", "MyDoc" }
        //    };
        //}

	    

        
        



	    //public async Task<IActionResult> Test()
	    //{
     //       //DataCreator.CreateInitialData();


     //       return View();
	    //}

     //   public IActionResult Test2()
     //   {
            
     //       return View();
     //   }


    }
}
