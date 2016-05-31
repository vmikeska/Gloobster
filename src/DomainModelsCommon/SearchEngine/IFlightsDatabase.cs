using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightsDatabase
    {
        SearchResultDO GetQueryResults(FlightDbQueryDO query);
    }
}