using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Api.Geo;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.PinBoard;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{
    [Route("api/[controller]")]
    public class PinStatsController : BaseApiController
    {
        public IPinBoardStats PinBoardStats { get; set; }

        public PinStatsController(IPinBoardStats pinBoardStats, ILogger log, IDbOperations db) : base(log, db)
        {
            PinBoardStats = pinBoardStats;
        }
        
        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(int gid)
        {           
            var responser = new PinsResponser
            {
                PinBoardStats = PinBoardStats
            };

            PinBoardStatResponse stats = await responser.Create(UserId);
            
            return new ObjectResult(stats);
        }

    }
}