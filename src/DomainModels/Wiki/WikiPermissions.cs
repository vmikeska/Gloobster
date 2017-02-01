using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public List<WikiPermissionEntity> Permissions { get; set; }
        
        public void RefreshPermissions()
        {
            Permissions = DB.List<WikiPermissionEntity>();
        }

        public bool IsAdminOfSomething(string userId)
        {
            var userIdObj = new ObjectId(userId);
            var perm = Permissions.FirstOrDefault(u => u.User_id == userIdObj);
            return perm != null;            
        }

        public bool IsMasterAdmin(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var perm = Permissions.FirstOrDefault(u => u.User_id == userIdObj);
            if (perm == null)
            {
                return false;
            }

            return perm.IsMasterAdmin;
        }

        public bool IsSuperAdmin(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var perm = Permissions.FirstOrDefault(u => u.User_id == userIdObj);
            if (perm == null)
            {
                return false;
            }

            return perm.IsSuperAdmin;
        }

        public bool IsSuperOrMasterAdmin(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var perm = Permissions.FirstOrDefault(u => u.User_id == userIdObj);
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

            var perm = Permissions.FirstOrDefault(u => u.User_id == userIdObj);
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

            var articleTexts = DB.FOD<WikiTextsEntity>(a => a.Article_id == articleIdObj);

            if (articleTexts.Type == ArticleType.Country)
            {
                return false;
            }

            if (articleTexts.Type == ArticleType.City)
            {
                var articleCity = DB.FOD<WikiCityEntity>(c => c.id == articleIdObj);
                var articleCountry = DB.FOD<WikiCountryEntity>(c => c.CountryCode == articleCity.CountryCode);

                return perm.Articles.Contains(articleCountry.id);
            }

            return false;

        }

        public async Task AddArticlePermission(string userId, string articleId)
        {
            var articleIdObj = new ObjectId(articleId);
            var userIdObj = new ObjectId(userId);

            var f1 = DB.F<WikiPermissionEntity>().Eq(p => p.User_id, userIdObj);
            var u1 = DB.U<WikiPermissionEntity>().Push(p => p.Articles, articleIdObj);
            var r1 = await DB.UpdateAsync(f1, u1);
            RefreshPermissions();
        }

        public async Task RemoveArticlePermission(string userId, string articleId)
        {
            var articleIdObj = new ObjectId(articleId);
            var userIdObj = new ObjectId(userId);

            var f1 = DB.F<WikiPermissionEntity>().Eq(p => p.User_id, userIdObj);
            var u1 = DB.U<WikiPermissionEntity>().Pull(p => p.Articles, articleIdObj);
            var r1 = await DB.UpdateAsync(f1, u1);
            RefreshPermissions();
        }

        public async Task DeleteAdmin(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var entity = DB.FOD<WikiPermissionEntity>(u => u.User_id == userIdObj);
            await DB.DeleteAsync<WikiPermissionEntity>(entity.id);
            RefreshPermissions();
        }

        public async Task<bool> CreateNewMasterAdmin(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var user = Permissions.FirstOrDefault(p => p.User_id == userIdObj);
            bool existing = user != null;
            if (!existing)
            {
                var newSupAdmin = new WikiPermissionEntity
                {
                    IsSuperAdmin = false,
                    IsMasterAdmin = true,
                    id = ObjectId.GenerateNewId(),
                    User_id = userIdObj,
                    Articles = null
                };
                await DB.SaveAsync(newSupAdmin);
                RefreshPermissions();
                return true;
            }

            return false;
        }

        public async Task<bool> CreateNewSuperAdmin(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var user = Permissions.FirstOrDefault(p => p.User_id == userIdObj);
            bool existing = user != null;
            if (!existing)
            {                
                var newSupAdmin = new WikiPermissionEntity
                {
                    IsSuperAdmin = true,
                    IsMasterAdmin = false,
                    id = ObjectId.GenerateNewId(),
                    User_id = userIdObj,
                    Articles = null
                };                
                await DB.SaveAsync(newSupAdmin);
                RefreshPermissions();
                return true;
            }

            return false;
        }
        
        public async Task<bool> CreateNewEmptyAdmin(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var user = Permissions.FirstOrDefault(p => p.User_id == userIdObj);
            bool existing = user != null;
            if (!existing)
            {
                var newAdmin = new WikiPermissionEntity
                {
                    IsSuperAdmin = false,
                    IsMasterAdmin = false,
                    id = ObjectId.GenerateNewId(),
                    User_id = userIdObj,
                    Articles = new List<ObjectId>()
                };
                await DB.SaveAsync(newAdmin);
                RefreshPermissions();
                return true;
            }
            
            return false;            
        }
    }
}