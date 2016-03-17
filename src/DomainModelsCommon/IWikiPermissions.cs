namespace Gloobster.DomainInterfaces
{
    public interface IWikiPermissions
    {
        bool HasArticleAdminPermissions(string userId, string articleId);
        bool CanManageArticleAdmins(string userId);
    }
}