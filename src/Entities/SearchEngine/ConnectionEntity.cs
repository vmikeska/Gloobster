using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;

namespace Gloobster.Entities.SearchEngine
{
    public class WeekendConnectionEntity : EntityBase
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }
        public int ToCityId { get; set; }
        public string ToMapId { get; set; }
        public string CityName { get; set; }
        public string CountryCode { get; set; }
        
        public List<WeekendGroupSE> WeekFlights { get; set; }
        
    }

    public class AnytimeConnectionEntity : EntityBase
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }
        public int ToCityId { get; set; }        
        public string CityName { get; set; }
        public string CountryCode { get; set; }
        public double FromPrice { get; set; }

        public List<FlightSE> Flights { get; set; }
    }

    public class AnytimeGroupSE
    {
        public int WeekNo { get; set; }
        public int Year { get; set; }
        public List<FlightSE> Flights { get; set; }

        public double FromPrice { get; set; }
    }

    public class WeekendGroupSE
    {
        public int WeekNo { get; set; }
        public int Year { get; set; }
        public List<FlightSE> Flights { get; set; }

        public double FromPrice { get; set; }        
    }




    public class SingleFlightSE
    {
        public string From { get; set; }
        public string To { get; set; }
    }
}
