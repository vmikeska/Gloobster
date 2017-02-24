using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.SearchEngine8;
using Gloobster.DomainModels.SearchEngine8.Queuing;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine8;
using Gloobster.Enums.SearchEngine;
using Gloobster.ReqRes.SearchEngine8;
using Gloobster.Mappers.SearchEngine8;

namespace Gloobster.Portal.Controllers.Api.SearchEngine
{
    [Route("api/[controller]")]
    public class DealsController : BaseApiController
    {
        public IClientRequestExecutor ClientExecutor { get; set; }
        public INewAirportCache AirCache { get; set; }


        public DealsController(INewAirportCache airCache, IClientRequestExecutor clientExecutor, ILogger log, IDbOperations db) : base(log, db)
        {
            ClientExecutor = clientExecutor;
            AirCache = airCache;
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(SearchRequest req)
        {
            if (req.timeType == TimeType.Anytime)
            {
                var results = await GetResults<AnytimeResultDO>(req);
                var cr = results.Select(r => r.ToResponse<AnytimeResultDO, AnytimeResultResponse>());
                return new ObjectResult(cr);
            }

            if (req.timeType == TimeType.Weekend)
            {
                //if (req.qids != null)
                //{
                //    if (req.qids.Any())
                //    {
                        
                //    }
                //}

                if (!req.firstQuery)
                {
                    
                }

                var results = await GetResults<WeekendResultDO>(req);
                var cr = results.Select(r => r.ToResponse<WeekendResultDO, WeekendResultResponse>());
                return new ObjectResult(cr);
            }

            if (req.timeType == TimeType.Custom)
            {
                var results = await GetResults<CustomResultDO>(req);
                var cr = results.Select(r => r.ToResponse<CustomResultDO, CustomResultResponse>());
                return new ObjectResult(cr);
            }
            
            return new ObjectResult(null);
        }


        private async Task<List<FlightQueryResult8DO<T>>> GetResults<T>(SearchRequest req)
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
            
            var unfinishedResults = results.Where(r => r.State != QueryState.Failed && r.State != QueryState.Finished).ToList();
            EnrichByCities(unfinishedResults);

            return results;
        }

        private void EnrichByCities<T>(List<FlightQueryResult8DO<T>> results)
        {
            foreach (var result in results)
            {
                result.ToName = result.To;

                if (result.ToType == PlaceType.City)
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

        private DestinationRequests8DO ExtractDests(SearchRequest req)
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


    
}