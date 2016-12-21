using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IKiwiResultsProcessor
    {
        Task ProcessFlightsAsync(List<FlightDO> flights, TimeType timeType, string queryId, string prms);
    }
}