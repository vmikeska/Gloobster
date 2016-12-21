using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public string BookLink { get; set; }
    }
}
