using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainModels.SearchEngine8.Executing;
using Gloobster.DomainObjects.SearchEngine8;

namespace Gloobster.Portal.Controllers.Api.Planning
{
	[Route("api/[controller]")]
	public class SkypickerTicketController : BaseApiController
	{				
		
		public SkypickerTicketController(ILogger log, IDbOperations db) : base(log, db)
		{			
			
		}


		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(FlightRequest req)
		{
            var caller = new Calls();

            var baseUrl = "https://api.skypicker.com/";
            var endpoint = "flights";
            
            var qb = new QueryBuilder();
		    qb
		        .BaseUrl(baseUrl)
		        .Endpoint(endpoint)
		        
		        .Param("partner", "picky")
		        .Param("v", "3");


            foreach (var prop in req.GetType().GetProperties())
            {                
                var value = prop.GetValue(req, null);
                if (value != null)
                {
                    var str = value.ToString();
                    if (!string.IsNullOrEmpty(str))
                    {
                        qb.Param(prop.Name, str);
                    }
                }                
            }
            
            var query = qb.Build();

            var result = caller.CallServer<SearchResultRoot>(query);

            var converted = result.data.Select(f => Convert(f)).ToList();

            return new ObjectResult(converted);
		}

	    private DateTime ConvertDate(int seconds)
	    {
	        var date = new DateTime(1970, 1, 1);
	        date = date.AddSeconds(seconds);
	        return date;
	    }
        
        private Result Convert(KiwiFlightSearchResult flight)
        {
            var flightParts = new List<FlightPartDO>();
            foreach (var route in flight.route)
            {
                var dTimeUtc = ConvertDate(route.dTimeUTC);
                var aTimeUtc = ConvertDate(route.aTimeUTC);
                TimeSpan duration = aTimeUtc - dTimeUtc;

                var flightPart = new FlightPartDO
                {
                    From = route.flyFrom,
                    To = route.flyTo,
                    DeparatureTime = ConvertDate(route.dTime),
                    ArrivalTime = ConvertDate(route.aTime),
                    Airline = route.airline,
                    MinsDuration = (int)duration.TotalMinutes
                };
                flightParts.Add(flightPart);
            }
            
            var res = new Result
            {
                Price = flight.price,
                HoursLength = GetDuration(flight.fly_duration),
                Stops = flight.route.Count - 1,
                From = flight.flyFrom,
                To = flight.flyTo,
                FlightParts = flightParts
            };
            return res;
        }

        private double GetDuration(string time)
        {
            var prms = time.Split(' ');
            double res = double.Parse(prms[0].Replace("h", ""));
            double mins = double.Parse(prms[1].Replace("m", ""));

            if (mins > 0)
            {
                res += (60 / mins);
            }

            return res;
        }
    }


    public class FlightRequest
    {
        public string flyFrom { get; set; }
        public string dateFrom { get; set; }
        public string dateTo { get; set; }
        public string to { get; set; }
        public string oneforcity { get; set; }
        public string daysInDestinationFrom { get; set; }
        public string daysInDestinationTo { get; set; }        
        public string typeFlight { get; set; }
        public string directFlights { get; set; }
        public string onlyWeekends { get; set; }
        public string one_per_date { get; set; }
        public string price_from { get; set; }
        public string price_to { get; set; }
        public string returnFrom { get; set; }
        public string returnTo { get; set; }
        public string passengers { get; set; } 
    }

    //////////////
    public class TestCall
    {
        public void GetResults()
        {
            var caller = new Calls();

            var baseUrl = "https://api.skypicker.com/";
            var endpoint = "flights";

            var qb = new QueryBuilder();
            qb
            .BaseUrl(baseUrl)
            .Endpoint(endpoint)
            .Param("flyFrom", "PRG")
            .Param("to", "FRA")
            .Param("dateFrom", "01/06/2016")
            .Param("dateTo", "30/06/2016");

            var query = qb.Build();

            var result = caller.CallServer<SearchResultRoot>(query);

            var converted = result.data.Select(f => Convert(f)).ToList();

        }

        private Result Convert(KiwiFlightSearchResult flight)
        {
            var res = new Result
            {
                Price = flight.price,
                HoursLength = GetDuration(flight.fly_duration),
                Stops = flight.route.Count - 1
            };
            return res;
        }

        private double GetDuration(string time)
        {
            var prms = time.Split(' ');
            double res = double.Parse(prms[0].Replace("h", ""));
            double mins = double.Parse(prms[1].Replace("m", ""));

            res += (60 / mins);
            return res;
        }


    }
    
    public class Result
    {
        public int Price { get; set; }
        public int Stops { get; set; }
        public double HoursLength { get; set; }
        public string From { get; set; }
        public string To { get; set; }

        public List<FlightPartDO> FlightParts { get; set; }

        public string FlightPartsStr
        {
            get
            {
                var prts = FlightParts.Select(f => $"{f.From}-->{f.To} || {f.DeparatureTime} - {f.ArrivalTime}");
                return string.Join("<br/>", prts);
            }
        }
    }    
}