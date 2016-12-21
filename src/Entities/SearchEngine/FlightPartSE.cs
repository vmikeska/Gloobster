using System;

namespace Gloobster.Entities.SearchEngine
{
    public class FlightPartSE
    {
        public DateTime DeparatureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public string From { get; set; }
        public string To { get; set; }

        public string Airline { get; set; }
        public int MinsDuration { get; set; }
        public int FlightNo { get; set; }

        
    }
}