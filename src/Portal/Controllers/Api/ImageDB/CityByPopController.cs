using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using Gloobster.Entities.ImageDB;
using System.Linq;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.GeonamesService;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class CityByPopController : BaseApiController
    {
        public IGeoNamesService GNS { get; set; }

        public CityByPopController(IGeoNamesService gns, ILogger log, IDbOperations db) : base(log, db)
        {
            GNS = gns;
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(int mp)
        {
            var res = await GNS.GetCityByPopulation(mp);
            
            return new ObjectResult(res);            
        }
        
    }
   
}