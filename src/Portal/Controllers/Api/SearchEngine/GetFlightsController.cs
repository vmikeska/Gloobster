using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.Entities.SearchEngine;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Mappers;

namespace Gloobster.Portal.Controllers.Api.Planning
{
    [Route("api/[controller]")]
    public class GetFlightsController : BaseApiController
    {
        public IFlightsDatabase FlightsDb { get; set; }
        public IFlightsForUser UserFlights { get; set; }
        
        public GetFlightsController(IFlightsForUser userFlights, IFlightsDatabase flightsDb, ILogger log, IDbOperations db) : base(log, db)
        {
            FlightsDb = flightsDb;
            UserFlights = userFlights;
        }
        
        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get(FlightsRequest req)
        {
            var con = DB.FOD<WeekendConnectionEntity>(e => e.FromAirport == req.from && e.ToAirport == req.to);
            var week = con.WeekFlights.FirstOrDefault(w => w.WeekNo == req.weekNo);
            List<FlightDO> flights = week.Flights.Select(f => f.ToDO()).ToList();
            
            return new ObjectResult(flights);
        }
        
      
    }

    public class FlightsRequest
    {
        public int weekNo { get; set; }
        public string to { get; set; }
        public string from { get; set; }        
    }
    
}