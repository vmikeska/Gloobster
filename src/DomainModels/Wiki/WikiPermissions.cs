using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{
    public class WikiPermissions : IWikiPermissions
    {
        public IDbOperations DB { get; set; }

        public bool CanManageArticleAdmins(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var perm = DB.C<WikiPermissionEntity>().FirstOrDefault(u => u.User_id == userIdObj);
            if (perm == null)
            {
                return false;
            }

            return (perm.IsMasterAdmin || perm.IsSuperAdmin);
        }

        public bool HasArticleAdminPermissions(string userId, string articleId)
        {
            var userIdObj = new ObjectId(userId);
            var articleIdObj = new ObjectId(articleId);

            var perm = DB.C<WikiPermissionEntity>().FirstOrDefault(u => u.User_id == userIdObj);
            if (perm == null)
            {
                return false;
            }

            if (perm.IsMasterAdmin || perm.IsSuperAdmin)
            {
                return true;
            }

            if (perm.Articles == null)
            {
                return false;
            }

            if (perm.Articles.Contains(articleIdObj))
            {
                return true;
            }

            var articleTexts = DB.C<WikiTextsEntity>().FirstOrDefault(a => a.Article_id == articleIdObj);

            if (articleTexts.Type == ArticleType.Country)
            {
                return false;
            }

            if (articleTexts.Type == ArticleType.City)
            {
                var articleCity = DB.C<WikiCityEntity>().FirstOrDefault(c => c.id == articleIdObj);
                var articleCountry = DB.C<WikiCountryEntity>().FirstOrDefault(c => c.CountryCode == articleCity.CountryCode);

                return perm.Articles.Contains(articleCountry.id);
            }

            return false;

        }
    }
}