using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class GnOnlineController : BaseApiController
    {
        public IGeoNamesOnlineService GnOnline { get; set; }

        public GnOnlineController(IGeoNamesOnlineService gnOnline, ILogger log, IDbOperations db) : base(log, db)
        {
            GnOnline = gnOnline;
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(string q)
        {
            var res = await GnOnline.SearchCities(q);

            return new ObjectResult(res);
        }
    }
}