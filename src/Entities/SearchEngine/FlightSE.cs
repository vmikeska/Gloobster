using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;

namespace Gloobster.Entities.SearchEngine
{
    public class FlightSE 
    {
        public string From { get; set; }
        public string To { get; set; }

        public double Price { get; set; }
        public int Connections { get; set; }
        public double HoursDuration { get; set; }

        public double FlightScore { get; set; }

        public List<FlightPartSE> FlightParts { get; set; }
    }

    public class FlightPartSE
    {
        public DateTime DeparatureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public string From { get; set; }
        public string To { get; set; }

        public string Airline { get; set; }
        public int MinsDuration { get; set; }
        public int FlightNo { get; set; }

        public string BookLink { get; set; }
    }
}
