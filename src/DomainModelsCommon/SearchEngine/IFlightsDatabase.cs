using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightsDatabase
    {
        FlightSearchDO GetFlights(FlightQueryDO query);
        List<FlightSearchDO> GetFlights(FlightRecordQueryDO query);
    }
}