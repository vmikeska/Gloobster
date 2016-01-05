using System.Collections.Generic;
using Gloobster.Database;

namespace Gloobster.SearchEngine.EntitiesSearch
{
    public class ConnectionEntity : EntityBase
    {
        public string From { get; set; }
        public string To { get; set; }

        public List<FlightSE> Flights { get; set; }
    }

    public class FlightSE
    {
        public double Price { get; set; }    
        public int Duration { get; set; }
        public int Stops { get; set; }
        public string FlightId1 { get; set; }
        public string FlightId2 { get; set; }        
    }
}
