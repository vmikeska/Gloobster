using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface IWikiPermissions
    {
        bool HasArticleAdminPermissions(string userId, string articleId);
        bool IsSuperOrMasterAdmin(string userId);
        bool IsAdminOfSomething(string userId);
        bool IsSuperAdmin(string userId);
        bool IsMasterAdmin(string userId);

        Task AddArticlePermission(string userId, string articleId);
        Task RemoveArticlePermission(string userId, string articleId);

        Task<bool> CreateNewMasterAdmin(string userId);
        Task<bool> CreateNewSuperAdmin(string userId);
        Task<bool> CreateNewEmptyAdmin(string userId);
        Task DeleteAdmin(string userId);
    }
}