using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Serilog;
using System.Linq;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class WikiDoDontController: BaseApiController
	{
        public IWikiPermissions WikiPerms { get; set; }

        public WikiDoDontController(IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiPerms = wikiPerms;
        }

	    [HttpDelete]
	    [AuthorizeApi]
	    public async Task<IActionResult> Delete(UpdateDoDontRequest req)
	    {
	        if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
	        {
	            return HttpUnauthorized();
	        }

            var articleIdObj = new ObjectId(req.articleId);
            var idObj = new ObjectId(req.id);

            var texts = DB.C<WikiTextsEntity>().FirstOrDefault(t => t.Article_id == articleIdObj);

            if (texts.Type == ArticleType.City)
            {
                await Delete<WikiCityEntity>(req.type, articleIdObj, idObj);
            }

            if (texts.Type == ArticleType.Country)
            {
                await Delete<WikiCountryEntity>(req.type, articleIdObj, idObj);
            }
            
            //todo: delete texts
	        
            return new ObjectResult(true);
	    }

        private async Task<bool> Delete<T>(string type, ObjectId articleIdObj, ObjectId idObj) where T : WikiArticleBaseEntity
        {
            var target = type == "do" ? "Dos" : "Donts";
            var f1 = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);
            var u1 = DB.U<WikiCityEntity>().Pull(target, idObj);
            var r1 = await DB.UpdateAsync(f1, u1);
            return r1.ModifiedCount == 1;
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] UpdateDoDontRequest req)
        {
            if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
            {
                return HttpUnauthorized();
            }

            var articleIdObj = new ObjectId(req.articleId);

            var texts = DB.C<WikiTextsEntity>().FirstOrDefault(t=>t.Article_id == articleIdObj);
               
            var text = new SectionTextsSE
            {
                Likes = new List<ObjectId>(),
                Dislikes = new List<ObjectId>(),
                Section_id = ObjectId.GenerateNewId(),
                Text = req.text
            };
            
            var f2 = DB.F<WikiTextsEntity>().Eq(p => p.Article_id, articleIdObj) 
                & DB.F<WikiTextsEntity>().Eq(p => p.Language, req.language);
            var u2 = DB.U<WikiTextsEntity>().Push(e => e.Texts, text);
            var r2 = await DB.UpdateAsync(f2, u2);

            if (texts.Type == ArticleType.City)
            {
                await Save<WikiCityEntity>(req.type, articleIdObj, text.Section_id);
            }

            if (texts.Type == ArticleType.Country)
            {
                await Save<WikiCountryEntity>(req.type, articleIdObj, text.Section_id);
            }
            
            return new ObjectResult(text.Section_id.ToString());
        }

        private async Task<bool> Save<T>(string type, ObjectId articleIdObj, ObjectId sectionId) where T : WikiArticleBaseEntity
        {
            var target = type == "do" ? "Dos" : "Donts";
            var f1 = DB.F<T>().Eq(p => p.id, articleIdObj);
            var u1 = DB.U<T>().Push(target, sectionId);
            var r1 = await DB.UpdateAsync(f1, u1);
            return r1.ModifiedCount == 1;
        }
        
        [HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] UpdateDoDontRequest req)
		{
            if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
            {
                return HttpUnauthorized();
            }

            var articleIdObj = new ObjectId(req.articleId);
            var idObj = new ObjectId(req.id);

            var f1 = DB.F<WikiTextsEntity>().Eq(p => p.Article_id, articleIdObj)
                & DB.F<WikiTextsEntity>().Eq(p => p.Language, req.language)
                & DB.F<WikiTextsEntity>().Eq("Texts.Section_id", idObj);
            var u1 = DB.U<WikiTextsEntity>().Set("Texts.$.Text", req.text);            
            var r1 = await DB.UpdateAsync(f1, u1);

            bool updated = r1.ModifiedCount == 1;
            return new ObjectResult(updated);            
		}
        
	}
}