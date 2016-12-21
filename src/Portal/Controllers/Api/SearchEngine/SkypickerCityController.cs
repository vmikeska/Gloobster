using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Enums.SearchEngine;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.SearchEngine
{
	[Route("api/[controller]")]
	public class SkypickerCityController : BaseApiController
	{	
        public IKiwiResultsExecutor SpProvider { get; set; }
        public IFlightScoreEngine ScoreEngine { get; set; }

        public SkypickerCityController(IFlightScoreEngine scoreEngine, IKiwiResultsExecutor spProvider, ILogger log, IDbOperations db) : base(log, db)
        {
            SpProvider = spProvider;
            ScoreEngine = scoreEngine;
        }
        
		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(SpCityRequest req)
		{
		    var fr = new FlightRequestDO();

		    var flights = new List<FlightDO>();
            
            foreach (var pair in req.codePairs)
		    {
		        var prms = pair.Split('-');
		        var codeFrom = prms.First();
		        var codeTo = prms.Last();
                
		        if (req.ss == SpSearchStyle.BestDealsOfCity)
		        {
		            var today = DateTime.UtcNow;

		            int startDay = 1;
		            if (today.Month == req.monthNo && today.Year == req.yearNo)
		            {
		                startDay = today.Day;
		            }

		            var startDate = new DateTime(req.yearNo, req.monthNo, startDay);
		            var endDate = startDate.AddMonths(1);

		            fr.flyFrom = codeFrom;
		            fr.to = codeTo;
		            fr.dateFrom = startDate.ToDate().ToString();
		            fr.dateTo = endDate.ToDate().ToString();
		            fr.one_per_date = "1";

		            //maybe is still needed
		            //fr.typeFlight = "round";		        
		            fr.daysInDestinationFrom = req.daysFrom.ToString();
		            fr.daysInDestinationTo = req.daysTo.ToString();
		        }

		        if (req.ss == SpSearchStyle.CustomCity)
		        {
		            Date dfrom = req.dateFrom.ToDate('_');
		            var dtFrom = dfrom.ToDateStart(DateTimeKind.Utc);
		            Date dto = req.dateTo.ToDate('_');
		            var dtTo = dto.ToDateStart(DateTimeKind.Utc);

		            var spanDiff = dtTo - dtFrom;
		            int days = spanDiff.Days;

		            fr.flyFrom = codeFrom;
		            fr.to = codeTo;

		            fr.dateFrom = dfrom.ToString();
		            fr.dateTo = dfrom.ToString();
		            fr.daysInDestinationFrom = days.ToString();
		            fr.daysInDestinationTo = days.ToString();

		            fr.dateTo = req.dateTo.Replace("_", "/");
		        }

                List<FlightDO> spFlights = SpProvider.Search(fr);
                var evaluatedFlights = ScoreEngine.FilterFlightsByScore(spFlights, req.scoreLevel);
		        flights.AddRange(evaluatedFlights.Passed);
		    }
            
            return new ObjectResult(flights);
		}
        
    }
    

    public class SpCityRequest
    {
        public SpSearchStyle ss { get; set; }
     
        public ScoreLevel scoreLevel { get; set; }

        public List<string> codePairs { get; set; }

        public int daysFrom { get; set; }
        public int daysTo { get; set; }
        public int monthNo { get; set; }
        public int yearNo { get; set; }

        public string dateFrom { get; set; }
        public string dateTo { get; set; }
    }

    public enum SpSearchStyle { BestDealsOfCity, CustomCity }    
}