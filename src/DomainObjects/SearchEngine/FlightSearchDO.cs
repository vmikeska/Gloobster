using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightSearchDO
    {
        public string FromPlace { get; set; }
        public string ToPlace { get; set; }
        
        //todo: optimize by one number
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }

        public List<FlightDO> Flights { get; set; }

        public object Params { get; set; }
    }

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

                int res = (int) ((last - first).TotalDays);
                return res;
            }
        }
    }

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
