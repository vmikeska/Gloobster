using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightDO
    {
        public string From { get; set; }
        public string To { get; set; }

        public decimal Price { get; set; }
        public int Stops { get; set; }
        public decimal HoursDuration { get; set; }
    }
}
