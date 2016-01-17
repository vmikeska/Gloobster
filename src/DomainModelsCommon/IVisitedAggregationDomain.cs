using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
    public interface IVisitedAggregationDomain
    {
        Task<bool> AddCountry(string countryCode, string userId);
        Task<bool> AddPlace(SourceType sourceType, string sourceId, LatLng coord, string userId);
        Task<bool> AddCity(int gid, string userId);
    }
}