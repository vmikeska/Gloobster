using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects.SearchEngine8;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IFlightsDb
    {
        Task<FlightQueryResult8DO<T>> GetResultsAsync<T>(FlightQuery8DO q);
        List<FlightQueryResult8DO<T>> CheckOnResults<T>(List<string> ids);
    }
}