using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
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
        public WikiUserCustomPermissionsController(ILogger log, IDbOperations db) : base(log, db)
        {

        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] PermissionRequest req)
        {
            //todo: check permissions

            var idObj = new ObjectId(req.id);

            var newSupAdmin = new WikiPermissionEntity
            {
                IsSuperAdmin = false,
                IsMasterAdmin = false,
                id = ObjectId.GenerateNewId(),
                User_id = idObj,
                Articles = new List<ObjectId>()
            };
            await DB.SaveAsync(newSupAdmin);

            return new ObjectResult(null);
        }

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(string id)
        {
            //todo: check permissions

            var idObj = new ObjectId(id);

            var entity = DB.C<WikiPermissionEntity>().FirstOrDefault(u => u.User_id == idObj);
            await DB.DeleteAsync<WikiPermissionEntity>(entity.id);

            return new ObjectResult(null);
        }

        //var f1 = DB.F<WikiPermissionEntity>().Eq(p => p.User_id, idObj);
        //var u1 = DB.U<WikiPermissionEntity>().PopFirst();
        //var r1 = await DB.UpdateAsync(f1, u1);
    }
}