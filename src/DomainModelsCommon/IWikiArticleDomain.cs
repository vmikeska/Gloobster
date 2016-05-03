using System.Threading.Tasks;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
    public interface IWikiArticleDomain
    {
        string CreateCity(CityDO city, string lang);
        string CreateCountry(Continent continent, string countryCode, string name, string lang, int capitalGID, string capitalName);
        Task CreateMissingSections();
    }
}