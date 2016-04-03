using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface IYelpSearchService
    {
        YelpSearchResult Search(string term, LatLng coord, int limit);
        Business GetById(string id);
    }
}