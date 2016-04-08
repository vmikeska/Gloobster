using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{    
    public class WikiPermissionsArticleController : BaseApiController
    {
        public IWikiPermissions WikiPerms { get; set; }

        public WikiPermissionsArticleController(IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiPerms = wikiPerms;            
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] PermissionArticleRequest req)
        {
            if (!WikiPerms.CanManageArticleAdmins(UserId))
            {
                return HttpUnauthorized();
            }

            await WikiPerms.AddArticlePermission(req.userId, req.articleId);
            
            return new ObjectResult(null);
        }

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(string userId, string articleId)
        {
            if (!WikiPerms.CanManageArticleAdmins(UserId))
            {
                return HttpUnauthorized();
            }

            await WikiPerms.RemoveArticlePermission(userId, articleId);


            return new ObjectResult(null);
        }

        
    }
}