using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface IYelpSearchService
    {
        Task<YelpSearchResult> Search(string term, LatLng coord);
        Task<Business> GetById(string id);
    }
}