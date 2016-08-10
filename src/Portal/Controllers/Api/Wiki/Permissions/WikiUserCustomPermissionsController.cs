using System.Collections.Generic;
using System.Linq;
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
    public class WikiUserCustomPermissionsController : BaseApiController
    {
        public IWikiPermissions WikiPerms { get; set; }

        public WikiUserCustomPermissionsController(IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiPerms = wikiPerms;
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