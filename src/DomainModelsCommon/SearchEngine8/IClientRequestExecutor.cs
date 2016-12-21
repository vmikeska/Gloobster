using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects.SearchEngine8;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IClientRequestExecutor
    {
        Task<List<FlightQueryResult8DO<T>>> ExeFirstRequestAsync<T>(string userId, TimeType timeType, string customId = null);

        Task<List<FlightQueryResult8DO<T>>> ExeSingleRequestsAsync<T>(string userId, TimeType timeType, DestinationRequests8DO dests, string customId = null);

        List<FlightQueryResult8DO<T>> ExeRequery<T>(List<string> ids);
    }
}