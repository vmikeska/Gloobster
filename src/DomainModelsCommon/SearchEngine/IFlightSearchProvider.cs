using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightSearchProvider
    {
        List<FlightDO> Search(FlightQueryDO query);
    }
}