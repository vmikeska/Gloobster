using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightSearchProvider
    {
        FlightSearchDO Search(FlightQueryDO query);
    }
}