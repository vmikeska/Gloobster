using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightWeekendQueryDO
    {
        public string FromPlace { get; set; }

        public string Id { get; set; }
        public FlightCacheRecordType Type { get; set; }
        //public Date FromDate { get; set; }
        //public Date ToDate { get; set; }
    }

    public class ConnectionDO
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }

        public List<FlightDO> Flights { get; set; }


        //this is just for storing rough direct flights
        public List<SingleFlightDO> SingleFlights { get; set; }
        //later then logic for extraction permanent flights will be added
    }

   



    public class SingleFlightDO
    {
        public string From { get; set; }
        public string To { get; set; }
    }

    public class FlightSearchResultDO
    {
        public string From { get; set; }
        public string To { get; set; }
        public FlightCacheRecordType Type { get; set; }

        public bool NotFinishedYet { get; set; }
        public bool QueryStarted { get; set; }

        public List<ConnectionDO> Connections { get; set; }
    }

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
    }

    //todo: remove
    public class FlightRecordQueryDO
    {
        public string FromPlace { get; set; }

        public string Id { get; set; }
        public FlightCacheRecordType Type { get; set; }
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }


}