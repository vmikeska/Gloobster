using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.NewAdmin.Wiki
{
    public class ArticleAdminResponse
    {
        public string id { get; set; }
        public string name { get; set; }
        public List<string> articles { get; set; }
    }

    public class WikiArticlesPermissionsController : BaseApiController
    {
        public IWikiPermissions WikiPerms { get; set; }

        public WikiArticlesPermissionsController(IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiPerms = wikiPerms;
        }

        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get()
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            var perms = DB.List<WikiPermissionEntity>();

            var articleAdmins = perms.Where(a => !a.IsMasterAdmin && !a.IsSuperAdmin).ToList();

            var userIds = perms.Select(u => u.User_id).ToList();
            var users = DB.List<UserEntity>(u => userIds.Contains(u.User_id));

            var results = new List<ArticleAdminResponse>();

            foreach (var articleAdmin in articleAdmins)
            {
                var user = users.FirstOrDefault(u => u.User_id == articleAdmin.User_id);

                var res = new ArticleAdminResponse
                {
                    id = articleAdmin.User_id.ToString(),
                    name = user.DisplayName,
                    articles = articleAdmin.Articles.Select(a => a.ToString()).ToList()
                };

                results.Add(res);
            }
            
            return new ObjectResult(results);
        }
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] PermissionRequest req)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            bool created = await WikiPerms.CreateNewEmptyAdmin(req.id);
            
            return new ObjectResult(created);
        }

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(string id)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            await WikiPerms.DeleteAdmin(id);

            return new ObjectResult(null);
        }
    }
}