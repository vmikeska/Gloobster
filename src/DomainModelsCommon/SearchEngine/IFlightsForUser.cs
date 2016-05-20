using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightsForUser
    {
        List<FlightSearchResultDO> GetUserWeekendOffers(string userId);
    }
}