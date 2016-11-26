using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface ICustomSearchDomain
    {
        void CreateDbStructure(string userId);
        Task<CustomSearchDO> CreateNewSearch(string userId);
        Task<bool> DeleteSearch(string userId, string searchId);

        Task<bool> UpdateName(string userId, string searchId, string name);
        Task<bool> UpdateStandardAir(string userId, string searchId, bool value);
        Task<bool> UpdateDaysRange(string userId, string searchId, int from, int to);
        Task<bool> AddCustomAir(string userId, string searchId, string text, int value);
        Task<bool> RemoveCustomAir(string userId, string searchId, int origId);
        Task<bool> UpdateDeparature(string userId, string searchId, Date dep);
        Task<bool> UpdateArrival(string userId, string searchId, Date arr);

    }
}