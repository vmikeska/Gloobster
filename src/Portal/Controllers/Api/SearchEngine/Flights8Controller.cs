using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.SearchEngine8;
using Gloobster.DomainModels.SearchEngine8.Queuing;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.SearchEngine
{
    [Route("api/[controller]")]
    public class Flights8Controller : BaseApiController
    {
        public IClientRequestExecutor ClientExecutor { get; set; }

        public Flights8Controller(IClientRequestExecutor clientExecutor, ILogger log, IDbOperations db) : base(log, db)
        {
            ClientExecutor = clientExecutor;
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(SearchRequest8 req)
        {
            if (req.timeType == TimeType8.Anytime)
            {
                var results = await GetResults<AnytimeResultDO>(req);
                //todo: create response class + convert to response
                return new ObjectResult(results);
            }

            if (req.timeType == TimeType8.Weekend)
            {
                var results = await GetResults<WeekendResultDO>(req);
                //todo: create response class + convert to response
                return new ObjectResult(results);
            }

            if (req.timeType == TimeType8.Custom)
            {
                var results = await GetResults<CustomResultDO>(req);
                //todo: create response class + convert to response
                return new ObjectResult(results);
            }
            
            return new ObjectResult(null);
        }


        private async Task<List<FlightQueryResult8DO<T>>> GetResults<T>(SearchRequest8 req)
        {
            var results = new List<FlightQueryResult8DO<T>>();

            if (req.firstQuery)
            {
                results = await ClientExecutor.ExeFirstRequestAsync<T>(UserId, req.timeType, req.customId);
            }
            else
            {
                var dests = ExtractDests(req);
                var singleResults = await ClientExecutor.ExeSingleRequestsAsync<T>(UserId, req.timeType, dests);
                results.AddRange(singleResults);

                if (req.qids != null)
                {
                    var requeryResults = ClientExecutor.ExeRequery<T>(req.qids);
                    results.AddRange(requeryResults);
                }
            }

            return results;
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