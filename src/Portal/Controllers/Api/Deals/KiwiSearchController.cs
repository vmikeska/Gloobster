using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;
using Gloobster.Common;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.Mappers.SearchEngine8;
using Gloobster.ReqRes.SearchEngine8;

namespace Gloobster.Portal.Controllers.Api.Deals
{
    [Route("api/[controller]")]
    public class KiwiSearchController : BaseApiController
    {	
        public IKiwiResultsExecutor Executor { get; set; }
        public INewAirportCityCache NewAirCache { get; set; }
        
        public KiwiSearchController(IKiwiResultsExecutor executor, INewAirportCityCache newAirCache, ILogger log, IDbOperations db) : base(log, db)
        {
            Executor = executor;
            NewAirCache = newAirCache;
        }
        
        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get(KiwiSearchGet req)
        {
            var depFrom = req.dateFrom.ToDate('_').ToString();
            var depTo = depFrom;

            var arrFrom = req.dateTo.ToDate('_').ToString();
            var arrTo = arrFrom;

            var request = new FlightRequestDO
            {
                dateFrom = depFrom,
                dateTo = depTo,

                returnFrom = arrFrom,
                returnTo = arrTo,

                flyFrom = GetKiwiCodeFromCode(req.from, req.fromType),
                to = GetKiwiCodeFromCode(req.to, req.toType),

                directFlights = req.justDirect ? "1" : "0",

                passengers = req.passengers.ToString(),
                //typeFlight = "round"
            };

            List<FlightDO> flights = Executor.Search(request);

            List<FlightResponse> fs = flights.Select(f => f.ToResponse()).ToList();

            return new ObjectResult(fs);
        }

        private string GetKiwiCodeFromCode(string code, DealsPlaceReturnType type)
        {
            if (type == DealsPlaceReturnType.GID)
            {
                int gid = int.Parse(code);
                var airRec = NewAirCache.GetByGID(gid);
                if (airRec == null)
                {
                    return "";
                }
                return airRec.SpId;
            }

            return code;
        }
   
    }

    

    public enum DealsPlaceReturnType { CountryCode, GID, AirCode }

    public class KiwiSearchGet
    {
        public string from { get; set; }        
        public DealsPlaceReturnType fromType { get; set; }

        public string to { get; set; }        
        public DealsPlaceReturnType toType { get; set; }

        public string dateFrom { get; set; }
        public string dateTo { get; set; }

        public int passengers { get; set; }

        public bool justDirect { get; set; }
    }
}