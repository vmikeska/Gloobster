using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.Portal.Controllers.Api.Planning
{
	[Route("api/[controller]")]
	public class SkypickerCityController : BaseApiController
	{	
        public ISkypickerSearchProvider SpProvider { get; set; }
        public IFlightScoreEngine ScoreEngine { get; set; }

        public SkypickerCityController(IFlightScoreEngine scoreEngine, ISkypickerSearchProvider spProvider, ILogger log, IDbOperations db) : base(log, db)
        {
            SpProvider = spProvider;
            ScoreEngine = scoreEngine;
        }
        
		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(SpCityRequest req)
		{
		    var fr = new FlightRequestDO();
		    
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

                fr.flyFrom = req.codeFrom;
                fr.to = req.codeTo;
                fr.dateFrom = startDate.ToDate().ToString();
                fr.dateTo = endDate.ToDate().ToString();
                fr.one_per_date = "1";
                
                //maybe is still needed
                //fr.typeFlight = "round";		        
                fr.daysInDestinationFrom = req.daysFrom.ToString();
                fr.daysInDestinationTo = req.daysTo.ToString();                                
		    }

            FlightSearchDO search = SpProvider.Search(fr);
		    var evaluatedFlights = ScoreEngine.FilterFlightsByScore(search.Flights, ScoreLevel.Standard);
            
            return new ObjectResult(evaluatedFlights.Passed);
		}
        
    }

    public class SpCityRequest
    {
        public SpSearchStyle ss { get; set; }
     
        public ScoreLevel scoreLevel { get; set; }

        public string codeFrom { get; set; }
        public string codeTo { get; set; }
        public int daysFrom { get; set; }
        public int daysTo { get; set; }
        public int monthNo { get; set; }
        public int yearNo { get; set; }
    }

    public enum SpSearchStyle { BestDealsOfCity }
}