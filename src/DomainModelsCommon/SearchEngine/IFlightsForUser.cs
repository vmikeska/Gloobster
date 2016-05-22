using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightsForUser
    {
        List<WeekendSearchResultDO> QuerySinglePlaces(List<RequeryDO> queries);
        List<WeekendSearchResultDO> QueryNewQueries(PlacesDO query);
    }
}