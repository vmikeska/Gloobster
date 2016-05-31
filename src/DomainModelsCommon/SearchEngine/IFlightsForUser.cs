using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightsForUser
    {
        List<SearchResultDO> CheckStartedQueries(List<RequeryDO> queries, TimeType timeType);
        List<SearchResultDO> QueryNewQueries(PlacesDO query, TimeType timeType);
    }
}