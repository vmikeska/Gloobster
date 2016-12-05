using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Planning;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Planning
{
    [Route("api/[controller]")]
    public class SelCityController : BaseApiController
    {
        public IPlanningDomain Planning { get; set; }

        public SelCityController(IPlanningDomain planning, ILogger log, IDbOperations db) : base(log, db)
        {
            DB = db;
            Planning = planning;
        }


        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] SelCityRequest req)
        {
            var selection = new CitySelectionDO
            {
                UserId = UserId,
                GID = req.gid,
                Selected = req.selected,
                PlanningType = req.type,
                CustomId = req.customId
            };
            
            bool success = await Planning.ChangeCitySelection(selection);
            return new ObjectResult(success);
        }

      

    }
}