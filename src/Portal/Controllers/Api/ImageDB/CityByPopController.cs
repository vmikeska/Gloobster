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
using Gloobster.Entities;

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

            var airportGroups = DB.List<NewAirportEntity>();

            var cities = res.Select(r =>
            {
                var air = airportGroups.FirstOrDefault(a => a.GID == r.GID);
                
                return new CityPopResponse
                {
                    g = r.GID,
                    n = r.Name,
                    c = r.CountryCode,
                    p = r.Population,
                    a = (air != null)
                };
            });

            return new ObjectResult(cities);
        }
        
    }

    public class CityPopResponse
    {
        //gid
        public int g { get; set; }
        //city name
        public string n { get; set; }        
        //country code
        public string c { get; set; }        
        //population
        public int p { get; set; }
        //has airport
        public bool a { get; set; }
    }

}