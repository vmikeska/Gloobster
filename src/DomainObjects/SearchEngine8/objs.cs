using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainObjects.SearchEngine8
{
    public class GroupedResultDO
    {
        public string From { get; set; }
        public string To { get; set; }

        public string CC { get; set; }
        public string Name { get; set; }
        public int GID { get; set; }

        public List<FlightDO> Flights { get; set; }
    }

    public class DestinationRequests8DO
    {
        public List<string> CCs { get; set; }
        public List<int> GIDs { get; set; }

        public bool Any()
        {
            return CCs.Any() || GIDs.Any();
        }
    }

    public class FlightQuery8DO
    {
        public string FromAir { get; set; }
        public string To { get; set; }
        public PlaceType ToType { get; set; }
        public string Params { get; set; }
        public TimeType TimeType { get; set; }
    }

    public class FlightQueryResult8DO<T>
    {
        public string QueryId { get; set; }
        public QueryState State { get; set; }

        public string From { get; set; }

        public string To { get; set; }
        public PlaceType ToType { get; set; }
        public string ToName { get; set; }

        public string Prms { get; set; }

        public List<T> Results { get; set; }
    }

    public class AnytimeResultDO
    {
        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }

        public List<FlightDO> Flights { get; set; }
    }

    public class WeekendResultDO
    {
        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }

        public int Week { get; set; }
        public int Year { get; set; }

        public List<FlightDO> Flights { get; set; }
    }

    public class CustomResultDO
    {
        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }

        public string UserId { get; set; }
        public string CustomId { get; set; }

        public List<FlightDO> Flights { get; set; }
    }
}
