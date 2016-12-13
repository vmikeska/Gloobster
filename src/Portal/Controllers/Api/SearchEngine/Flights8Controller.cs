using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.SearchEngine8;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Planning
{
    [Route("api/[controller]")]
    public class Flights8Controller : BaseApiController
    {
        public ClientRequestExecutor ClientExecutor { get; set; }

        public Flights8Controller(ILogger log, IDbOperations db) : base(log, db)
        {
            
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(SearchRequest8 req)
        {
            var results = new List<FlightQueryResult8DO>();

            if (req.firstQuery)
            {
                results = await ClientExecutor.ExeFirstRequestAsync(UserId, req.timeType, req.customId);
            }
            else
            {
                var dests = ExtractDests(req);
                var singleResults = await ClientExecutor.ExeSingleRequestsAsync(UserId, req.timeType, dests);
                results.AddRange(singleResults);

                if (req.qids != null)
                {
                    var requeryResults = ClientExecutor.ExeRequery(req.qids);
                    results.AddRange(requeryResults);
                }                
            }
            
            //todo: create response class + convert to response
            return new ObjectResult(results);
        }

        private DestinationRequests8DO ExtractDests(SearchRequest8 req)
        {
            var dests = new DestinationRequests8DO
            {
                CCs = new List<string>(),
                GIDs = new List<int>()
            };

            if (req.ccs != null)
            {
                dests.CCs = req.ccs;
            }

            if (req.gids != null)
            {
                dests.GIDs = req.gids;
            }

            return dests;
        }
        
    }



    public class SearchRequest8
    {
        public bool firstQuery { get; set; }
        public TimeType8 timeType { get; set; }
        public string customId { get; set; }

        public List<string> ccs { get; set; }
        public List<int> gids { get; set; }
        public List<string> qids { get; set; }

    }
}