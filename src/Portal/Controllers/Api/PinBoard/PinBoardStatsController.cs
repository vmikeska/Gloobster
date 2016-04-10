using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.PinBoard;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{
    [Route("api/[controller]")]
	public class PinBoardStatsController : BaseApiController
	{
        public IPinBoardStatRequestCreator RequestCreator { get; set; }

        public PinBoardStatsController(IPinBoardStatRequestCreator requestCreator, ILogger log, IDbOperations db) : base(log, db)
        {
            RequestCreator = requestCreator;
        }
        
        [HttpGet]
		[AuthorizeApi]
		public IActionResult Get(PinBoardStatRequest request)
        {
            var result = RequestCreator.DataForLoggedInUser(request, UserId);
            return new ObjectResult(result);
        }
	}
}