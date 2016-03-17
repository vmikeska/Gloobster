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
    public class WikiPermissionsArticleController : BaseApiController
    {
        public WikiPermissionsArticleController(ILogger log, IDbOperations db) : base(log, db)
        {

        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] PermissionArticleRequest req)
        {
            //todo: check permissions

            var articleIdObj = new ObjectId(req.articleId);
            var userIdObj = new ObjectId(req.userId);

            var f1 = DB.F<WikiPermissionEntity>().Eq(p => p.User_id, userIdObj);
            var u1 = DB.U<WikiPermissionEntity>().Push(p => p.Articles, articleIdObj);
            var r1 = await DB.UpdateAsync(f1, u1);
            
            return new ObjectResult(null);
        }

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(string userId, string articleId)
        {
            //todo: check permissions

            var articleIdObj = new ObjectId(articleId);
            var userIdObj = new ObjectId(userId);

            var f1 = DB.F<WikiPermissionEntity>().Eq(p => p.User_id, userIdObj);
            var u1 = DB.U<WikiPermissionEntity>().Pull(p => p.Articles, articleIdObj);
            var r1 = await DB.UpdateAsync(f1, u1);
            
            return new ObjectResult(null);
        }

        
    }
}