using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using System.Linq;
using Autofac;
using Gloobster.Entities;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Http.Extensions;
using MongoDB.Bson;
using MongoDB.Driver;
using UAParser;
using MongoDB.Bson.Serialization.Attributes;
using Octokit;

namespace Gloobster.Portal.Controllers.Portal
{
   
    public class ArticleController : PortalBaseController
    {
        public ArticleController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }

        
        public IActionResult Article(string id)
        {
            var vm = CreateViewModelInstance<ViewModelArticle>();
            //vm.DefaultLangModuleName = "pageWikiPage";

            if (id == "grottaglie-sun-ceramics-wine-street-art-food-oil")
            {
                return View("grottaglie-sun-ceramics-wine-street-art-food-oil", vm);
            }
            if (id == "malta-sea-sun")
            {
                return View("malta-sea-sun", vm);
            }
            if (id == "cinco-things-to-do-in-seville")
            {
                return View("cinco-things-to-do-in-seville", vm);
            }
            
            return View(vm);
        }

    }
    
}
