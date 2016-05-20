using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;

namespace Gloobster.Entities.SearchEngine
{
    public class ConnectionEntity : EntityBase
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }

        public List<FlightSE> Flights { get; set; }        
    }




    public class SingleFlightSE
    {
        public string From { get; set; }
        public string To { get; set; }
    }
}
