using System;
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
using Gloobster.Entities;
using Gloobster.Mappers.SearchEngine8;
using Gloobster.ReqRes.SearchEngine8;

namespace Gloobster.Portal.Controllers.Api.Deals
{
    [Route("api/[controller]")]
    public class KiwiSearchController : BaseApiController
    {	
        public IKiwiResultsExecutor Executor { get; set; }
        public INewAirportCityCache NewAirCache { get; set; }
        public IFlightScoreEngine ScoreEngine { get; set; }

        public KiwiSearchController(IFlightScoreEngine scoreEngine, IKiwiResultsExecutor executor, INewAirportCityCache newAirCache, ILogger log, IDbOperations db) : base(log, db)
        {
            Executor = executor;
            NewAirCache = newAirCache;
            ScoreEngine = scoreEngine;
        }
        
        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get(KiwiSearchGet req)
        {
            DateTime depDate = req.dateFrom.ToDate('_').ToDateStart(DateTimeKind.Utc);            
            Date myDepDateFrom = depDate.AddDays(-req.depFlexDays).ToDate();
            Date myDepDateTo = depDate.AddDays(req.depFlexDays).ToDate();
            
            var request = new FlightRequestDO
            {
                dateFrom = myDepDateFrom.ToString(),
                dateTo = myDepDateTo.ToString(),
                
                flyFrom = GetCodes(req.useHomeAirsFrom, req.from, req.fromType),
                to = GetCodes(req.useHomeAirsTo, req.to, req.toType),

                passengers = req.passengers.ToString()                
            };

            if (!req.justOneway)
            {
                DateTime arrDate = req.dateTo.ToDate('_').ToDateStart(DateTimeKind.Utc);                
                Date myRetDateFrom = arrDate.AddDays(-req.retFlexDays).ToDate();
                Date myRetDateTo = arrDate.AddDays(req.retFlexDays).ToDate();

                request.returnFrom = myRetDateFrom.ToString();
                request.returnTo = myRetDateTo.ToString();
            }

            List<FlightDO> flights = Executor.Search(request);

            ScoreFlights(flights, req.justOneway);

            List<FlightResponse> fs = flights.Select(f => f.ToResponse()).ToList();
            

            return new ObjectResult(fs);
        }

        private void ScoreFlights(List<FlightDO> flights, bool justOneway)
        {
            foreach (var f in flights)
            {
                double s = 0;
                if (justOneway)
                {
                    var s1 = ScoreEngine.EvaluateSingleFlight(f.FlightParts, (int)f.Price);
                    if (s1.HasValue)
                    {
                        s = s1.Value * 2;
                    }
                }
                else
                {
                    var s2 = ScoreEngine.EvaluateFlight(f);
                    if (s2.HasValue)
                    {
                        s = s2.Value;
                    }
                }

                f.FlightScore = s;
            }

        }

        private string GetCodes(bool useHome, string reqCode, DealsPlaceReturnType type)
        {
            string res = useHome ? string.Join(",",GetHomeAirs()) : GetKiwiCodeFromCode(reqCode, type);
            return res;
        }

        private List<string> GetHomeAirs()
        {
            var ua = DB.FOD<UserAirportsEntity>(u => u.User_id == UserIdObj);

            if (ua == null)
            {
                throw new Exception("UserAirportsNotFound");
            }

            var codes = ua.Airports.Select(a => a.AirCode).ToList();
            return codes;
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

        public bool justOneway { get; set; }

        public bool useHomeAirsFrom { get; set; }
        public bool useHomeAirsTo { get; set; }

        public int depFlexDays { get; set; }
        public int retFlexDays { get; set; }
        

    }
}