using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.SearchEngine8;
using Gloobster.DomainModels.SearchEngine8.Queuing;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;
using Gloobster.DomainModels.SearchEngine;

namespace Gloobster.Portal.Controllers.Api.SearchEngine
{
    [Route("api/[controller]")]
    public class DealsController : BaseApiController
    {
        public IClientRequestExecutor ClientExecutor { get; set; }
        public IAirportsCache AirCache { get; set; }


        public DealsController(IAirportsCache airCache, IClientRequestExecutor clientExecutor, ILogger log, IDbOperations db) : base(log, db)
        {
            ClientExecutor = clientExecutor;
            AirCache = airCache;
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(SearchRequest8 req)
        {
            if (req.timeType == TimeType8.Anytime)
            {
                var results = await GetResults<AnytimeResultDO>(req);
                var cr = results.Select(r => r.ToResponse<AnytimeResultDO, AnytimeResultResponse>());
                return new ObjectResult(cr);
            }

            if (req.timeType == TimeType8.Weekend)
            {
                var results = await GetResults<WeekendResultDO>(req);
                var cr = results.Select(r => r.ToResponse<WeekendResultDO, WeekendResultResponse>());
                return new ObjectResult(cr);
            }

            if (req.timeType == TimeType8.Custom)
            {
                var results = await GetResults<CustomResultDO>(req);
                var cr = results.Select(r => r.ToResponse<CustomResultDO, CustomResultResponse>());
                return new ObjectResult(cr);
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
                var singleResults = await ClientExecutor.ExeSingleRequestsAsync<T>(UserId, req.timeType, dests, req.customId);
                results.AddRange(singleResults);

                if (req.qids != null)
                {
                    var requeryResults = ClientExecutor.ExeRequery<T>(req.qids);
                    results.AddRange(requeryResults);
                }
            }
            
            var unfinishedResults = results.Where(r => r.State != QueryState8.Failed && r.State != QueryState8.Finished).ToList();
            EnrichByCities(unfinishedResults);

            return results;
        }

        private void EnrichByCities<T>(List<FlightQueryResult8DO<T>> results)
        {
            foreach (var result in results)
            {
                result.ToName = result.To;

                if (result.ToType == PlaceType8.City)
                {                    
                    int gid = int.Parse(result.To);
                    var airport = AirCache.GetAirportByGID(gid);
                    if (airport != null)
                    {
                        result.ToName = airport.Name;
                    }
                }                
            }
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

        //todo: add possiblity to request single week

        public List<string> ccs { get; set; }
        public List<int> gids { get; set; }
        public List<string> qids { get; set; }

    }
}