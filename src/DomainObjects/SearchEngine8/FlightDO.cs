using System.Collections.Generic;
using System.Linq;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightDO
    {
        public string From { get; set; }
        public string To { get; set; }

        public double Price { get; set; }
        public int Connections { get; set; }
        public double HoursDuration { get; set; }

        public double FlightScore { get; set; }

        public List<FlightPartDO> FlightParts { get; set; }

        public int DaysInDestination
        {
            get
            {
                var first = FlightParts.First().ArrivalTime;
                var last = FlightParts.Last().DeparatureTime;

                int res = (int)((last - first).TotalDays);
                return res;
            }
        }

        public string BookLink { get; set; }
    }
}