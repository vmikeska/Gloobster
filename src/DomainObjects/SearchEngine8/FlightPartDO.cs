using System;
using System.Threading.Tasks;
using Gloobster.Common;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightPartDO
    {
        public DateTime DeparatureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public string From { get; set; }
        public string To { get; set; }

        public string Airline { get; set; }
        public int FlightNo { get; set; }

        public int MinsDuration { get; set; }
    }

}
