using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.NewAdmin.Wiki
{    
    public class WikiArticlePermissionsController : BaseApiController
    {
        public IWikiPermissions WikiPerms { get; set; }

        public WikiArticlePermissionsController(IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiPerms = wikiPerms;            
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(string id)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            var uid = new ObjectId(id);

            var perm = DB.FOD<WikiPermissionEntity>(p => p.User_id == uid);

            if (perm == null)
            {
                return new ObjectResult(null);
            }
            
            var texts = DB.List<WikiTextsEntity>(t => perm.Articles.Contains(t.Article_id) && t.Language == "en");

            var res = texts.Select(t => new {id = t.Article_id.ToString(), name = t.Title}).ToList();

            return new ObjectResult(res);
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] PermissionArticleRequest req)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
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
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            await WikiPerms.RemoveArticlePermission(userId, articleId);


            return new ObjectResult(null);
        }

        
    }

    public class WikiArticlePermissionsGet
    {
        public List<string> ids { get;set; }
    }
}