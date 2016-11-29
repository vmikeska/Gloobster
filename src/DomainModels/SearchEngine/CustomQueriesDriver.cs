using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainModels.SearchEngine
{
    public class CustomQueriesDriver : IQueriesDriver
    {
        public List<FlightRequestDO> BuildRequests(string @from, string to, PlaceType toPlaceType)
        {
            return new List<FlightRequestDO>();
        }

        public async Task DeleteConnection(string from, string to)
        {
            
        }

        public object GetResultsOfFinishedQuery(List<FromToSE> fromTos)
        {
            return new List<WeekendConnectionDO>();
        }

        public async Task<ScoredFlightsDO> ProcessSearchResults(string toMapId, List<FlightSearchDO> weekSearches)
        {
            return new ScoredFlightsDO
            {
                Passed = new List<FlightDO>(),
                Discarded = new List<FlightDO>()
            };
        }
    }
}