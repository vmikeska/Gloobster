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
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class WikiPermissionsController : BaseApiController
    {
        public IWikiPermissions WikiPerms { get; set; }

        public WikiPermissionsController(IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiPerms = wikiPerms;
        }
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] PermissionRequest req)
        {
            if (!WikiPerms.CanManageArticleAdmins(UserId))
            {
                return HttpUnauthorized();
            }

            var idObj = new ObjectId(req.id);
            
            var newSupAdmin = new WikiPermissionEntity
            {
                IsSuperAdmin = true,
                IsMasterAdmin = false,
                id = ObjectId.GenerateNewId(),
                User_id = idObj,
                Articles = null
            };
            await DB.SaveAsync(newSupAdmin);
            
            return new ObjectResult(null);
        }

        [HttpDelete]
        [AuthorizeApi]        
        public async Task<IActionResult> Delete(string id)
        {
            if (!WikiPerms.CanManageArticleAdmins(UserId))
            {
                return HttpUnauthorized();
            }

            var idObj = new ObjectId(id);
            
            var entity = DB.C<WikiPermissionEntity>().FirstOrDefault(u => u.User_id == idObj);
            await DB.DeleteAsync<WikiPermissionEntity>(entity.id);
            
            return new ObjectResult(null);
        }
    }
}