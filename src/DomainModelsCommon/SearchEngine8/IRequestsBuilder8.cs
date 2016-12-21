using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine8;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IRequestsBuilder8
    {
        List<FlightQuery8DO> BuildQueriesAnytime(DestinationRequests8DO destinations, string userId);
        List<FlightQuery8DO> BuildQueriesWeekend(DestinationRequests8DO destinations, string userId);
        List<FlightQuery8DO> BuildQueriesCustom(DestinationRequests8DO destinations, string userId, string searchId);
    }
}