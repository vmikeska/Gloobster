using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface IWikiUpdateDomain
    {
        Task<bool> UpdateBaseSection(string articleId, string sectionId, string language, string newText);
        Task<bool> AddRating(string articleId, string sectionId, string language, string userId, bool like);
        Task<decimal> AddPriceRating(string articleId, string priceId, string userId, bool plus);
    }
}