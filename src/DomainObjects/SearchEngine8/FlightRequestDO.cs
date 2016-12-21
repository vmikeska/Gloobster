using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainObjects.SearchEngine
{
    

    public class FlightRequestDO
    {
        public string flyFrom { get; set; }
        public string dateFrom { get; set; }
        public string dateTo { get; set; }
        public string to { get; set; }
        public string oneforcity { get; set; }
        public string daysInDestinationFrom { get; set; }
        public string daysInDestinationTo { get; set; }
        public string typeFlight { get; set; }
        public string directFlights { get; set; }
        public string onlyWeekends { get; set; }
        public string one_per_date { get; set; }
        public string price_from { get; set; }
        public string price_to { get; set; }
        public string returnFrom { get; set; }
        public string returnTo { get; set; }
        public string passengers { get; set; }

        public object Params { get; set; }
    }



}