using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightDbQueryDO
    {
        public string FromPlace { get; set; }

        public string MapId { get; set; }
        public string Id { get; set; }
        public PlaceType ToType { get; set; }

        public TimeType TimeType { get; set; }
    }
    
    public class WeekendConnectionDO
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }
        public string ToMapId { get; set; }
        public int ToCityId { get; set; }
        public string CityName { get; set; }
        public string CountryCode { get; set; }
        
        public List<WeekendGroupDO> WeekFlights { get; set; }
    }

    public class AnytimeConnectionDO
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }
        public int ToCityId { get; set; }
        public string CityName { get; set; }
        public string CountryCode { get; set; }
        public double FromPrice { get; set; }

        public List<FlightDO> Flights { get; set; }
    }

    

    public class WeekendGroupDO
    {
        public int WeekNo { get; set; }
        public int Year { get; set; }
        public List<FlightDO> Flights { get; set; }

        public double FromPrice { get; set; }
    }

    public class ConnectionDO
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }

        public List<FlightDO> Flights { get; set; }        
    }




    public class RequeryDO
    {
        public string From { get; set; }
        public string To { get; set; }
        public PlaceType Type { get; set; }
    }


    public class SingleFlightDO
    {
        public string From { get; set; }
        public string To { get; set; }
    }

    public class SearchResultDO
    {
        public string From { get; set; }
        public string To { get; set; }
        public PlaceType Type { get; set; }

        public bool NotFinishedYet { get; set; }
        public bool QueryStarted { get; set; }

        public object Result { get; set; }
    }

    //public class OffersDO
    //{
    //    public string UserId { get; set; }
    //    public PlacesDO Excluded { get; set; }
    //    public PlacesDO Included { get; set; }
    //}

    public class PlacesDO
    {
        public string UserId { get; set; }
        public bool EntireQuery { get; set; }
        public List<int> Cities { get; set; }
        public List<string> Countries { get; set; }
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

        public object Params { get; set; }
    }

    //todo: remove
    public class FlightRecordQueryDO
    {
        public string FromPlace { get; set; }

        public string Id { get; set; }
        public PlaceType Type { get; set; }
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }


}