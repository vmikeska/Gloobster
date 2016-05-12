using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightsCache
    {
        void CacheQuery(FlightQueryDO query, List<FlightRecordDO> flights);        
        FlightSearchDO GetAirportConnections(FlightQueryDO query);
    }
}