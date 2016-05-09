using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightsDatabase
    {
        List<FlightDO> GetFlights(FlightQueryDO query);
    }
}