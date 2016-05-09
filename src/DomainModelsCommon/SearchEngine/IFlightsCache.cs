using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightsCache
    {
        void CacheQuery(FlightQueryDO query, List<FlightDO> flights);
        List<FlightDO> GetQuery(FlightQueryDO query);
    }
}