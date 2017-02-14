using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums;
using Gloobster.Enums.SearchEngine;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Deals
{
    [Route("api/[controller]")]
    public class DealsPlacesController : BaseApiController
    {
        public ICountryService CountrySvc { get; set; }
        public IGeoNamesService GNSvc { get; set; }

        public DealsPlacesController(IGeoNamesService gnSvc, ICountryService countrySvc, ILogger log, IDbOperations db) : base(log, db)
        {
            GNSvc = gnSvc;
            CountrySvc = countrySvc;
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(PlanningType type, string customId)
        {
            var ccs = new List<string>();
            var gids = new List<int>();

            if (type == PlanningType.Anytime)
            {
                var anytime = DB.FOD<DealsAnytimeEntity>(p => p.User_id == UserIdObj);
                if (anytime == null)
                {
                    return null;
                }
                
                ccs = anytime.CountryCodes;
                gids = anytime.Cities;
            }

            if (type == PlanningType.Weekend)
            {
                var weekend = DB.FOD<DealsWeekendEntity>(p => p.User_id == UserIdObj);
                if (weekend == null)
                {
                    return null;
                }

                ccs = weekend.CountryCodes;
                gids = weekend.Cities;
            }

            if (type == PlanningType.Custom)
            {
                var custom = DB.FOD<DealsCustomEntity>(p => p.User_id == UserIdObj);
                if (custom == null)
                {
                    return null;
                }

                var sid = new ObjectId(customId);
                var search = custom.Searches.FirstOrDefault(s => s.id == sid);

                ccs = search.CCs;
                gids = search.GIDs;
            }

            var res = new List<DealsPlaceResult>();


            foreach (var cc in ccs)
            {
                var c = CountrySvc.GetCountryByCountryCode2(cc);

                var r = new DealsPlaceResult
                {
                    code = cc,
                    type = PlaceType.Country,
                    name = c.CountryName
                };

                res.Add(r);
            }
            
            foreach (var gid in gids)
            {
                var city = await GNSvc.GetCityByIdAsync(gid);
                
                var r = new DealsPlaceResult
                {
                    code = gid.ToString(),
                    type = PlaceType.City,
                    name = city.AsciiName
                };

                res.Add(r);
            }



            return new ObjectResult(res);
        }

    }

    public class DealsPlaceResult
    {
        public string code { get; set; }
        public string name { get; set; }
        public PlaceType type { get; set; }
    }
}