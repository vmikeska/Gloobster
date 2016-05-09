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
            .Param("flyFrom", req.FromPlace)
            .Param("to", req.ToPlace)
            .Param("dateFrom", req.Deparature)
            .Param("dateTo", req.Return);

		    if (!string.IsNullOrEmpty(req.DirectFlight))
		    {
		        qb.Param("directFlights", req.DirectFlight);
            }

            if (!string.IsNullOrEmpty(req.DaysInDestinationFrom))
            {
                qb.Param("daysInDestinationFrom", req.DaysInDestinationFrom);
            }

            if (!string.IsNullOrEmpty(req.TypeFlight))
            {
                qb.Param("typeFlight", req.TypeFlight);
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
        
        private Result Convert(FlightSearchResult flight)
        {
            var flightParts = new List<FlightPart>();
            foreach (var route in flight.route)
            {
                var flightPart = new FlightPart
                {
                    From = route.flyFrom,
                    To = route.flyTo,
                    DeparatureTime = ConvertDate(route.dTime),
                    ArrivalTime = ConvertDate(route.aTime)
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
        public string FromPlace { get; set; }
        public string ToPlace { get; set; }
        public string Deparature { get; set; }
        public string Return { get; set; }

        public string DirectFlight { get; set; }
        public string DaysInDestinationFrom { get; set; }
        public string TypeFlight { get; set; }        
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

        private Result Convert(FlightSearchResult flight)
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

        public List<FlightPart> FlightParts { get; set; }

        public string FlightPartsStr
        {
            get
            {
                var prts = FlightParts.Select(f => $"{f.From}-->{f.To} || {f.DeparatureTime} - {f.ArrivalTime}");
                return string.Join("<br/>", prts);
            }
        }
    }

    public class FlightPart
    {
        public DateTime DeparatureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        
        public string From { get; set; }
        public string To { get; set; }
    }

}