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
            if (!WikiPerms.IsMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            bool created = await WikiPerms.CreateNewSuperAdmin(req.id);
            
            return new ObjectResult(created);
        }

        [HttpDelete]
        [AuthorizeApi]        
        public async Task<IActionResult> Delete(string id)
        {
            if (!WikiPerms.IsMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            await WikiPerms.DeleteAdmin(id);

            return new ObjectResult(null);
        }
    }
}