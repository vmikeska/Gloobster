using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;
using Gloobster.Portal.ViewModels;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.NewAdmin.Wiki
{
    public class WikiSuperAdminsController : BaseApiController
    {
        public IWikiPermissions WikiPerms { get; set; }

        public WikiSuperAdminsController(IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiPerms = wikiPerms;
        }

        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get(WikiPageSectionGet req)
        {
            if (!WikiPerms.IsMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            var perms = DB.List<WikiPermissionEntity>();

            var userIds = perms.Select(u => u.User_id).ToList();
            var users = DB.List<UserEntity>(u => userIds.Contains(u.User_id));

            var superAdmins = perms
                .Where(u => u.IsSuperAdmin)
                .ToList()
                .Select(i => ConvertUser(users, i.User_id))
                .ToList();

            return new ObjectResult(superAdmins);
        }

        private dynamic ConvertUser(List<UserEntity> users, ObjectId userId)
        {
            var user = users.FirstOrDefault(u => u.User_id == userId);

            if (user == null)
            {
                return null;
            }

            return new 
            {
                id = user.User_id.ToString(),
                name = user.DisplayName
            };
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