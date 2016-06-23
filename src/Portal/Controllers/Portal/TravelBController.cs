using System;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.ViewModels;
using Serilog;
using System.Linq;
using Autofac;
using Gloobster.Entities;
using Gloobster.Entities.TravelB;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Portal
{
    public class TravelBController : PortalBaseController
    {		
        public TravelBController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            
		}
        
        [CreateAccount]
        public IActionResult Home()
        {
            var vm = CreateViewModelInstance<TravelBViewModel>();
            
            return View(vm);
        }

        
        public IActionResult Management()
        {
            var vm = CreateViewModelInstance<TravelBManagementViewModel>();

            return View(vm);
        }
        
    }

    
}
