using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.SearchEngine8;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.SearchEngine
{
    [Route("api/[controller]")]
    public class ExeTestController : BaseApiController
    {
        public IQueriesExecutor QueriesExecutor { get; set; }

        public ExeTestController(IQueriesExecutor queriesExecutor, ILogger log, IDbOperations db) : base(log, db)
        {
            QueriesExecutor = queriesExecutor;
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get()
        {
            QueriesExecutor.ExecuteQueriesAsync();
            
            return new ObjectResult(null);
        }
        
    }
}