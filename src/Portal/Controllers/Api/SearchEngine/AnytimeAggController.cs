using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Planning
{
    [Route("api/[controller]")]
    public class AnytimeAggController : BaseApiController
    {
        public IFlightsDatabase FlightsDb { get; set; }
        public IFlightsForUser UserFlights { get; set; }


        public AnytimeAggController(IFlightsForUser userFlights, IFlightsDatabase flightsDb, ILogger log, IDbOperations db) : base(log, db)
        {
            FlightsDb = flightsDb;
            UserFlights = userFlights;
        }
        
        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get()
        {
            
            return new ObjectResult(null);
            
        }
        
        
    }
    
}