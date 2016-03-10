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

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class WikiDoDontController: BaseApiController
	{        
        public WikiDoDontController(ILogger log, IDbOperations db) : base(log, db)
        {
            
        }

	    [HttpDelete]
	    [AuthorizeApi]
	    public async Task<IActionResult> Delete(UpdateDoDontRequest req)
	    {
            var articleIdObj = new ObjectId(req.articleId);
            var idObj = new ObjectId(req.id);
            
	        var target = req.type == "do" ? "Dos" : "Donts";
            var f1 = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);
            var u1 = DB.U<WikiCityEntity>().Pull(target, idObj);            
            var r1 = await DB.UpdateAsync(f1, u1);

            //todo: delete texts
	        
            bool deleted = r1.ModifiedCount == 1;
            return new ObjectResult(deleted);	        
	    }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] UpdateDoDontRequest req)
        {
            var articleIdObj = new ObjectId(req.articleId);
            
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

            var target = req.type == "do" ? "Dos" : "Donts";
            var f1 = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);
            var u1 = DB.U<WikiCityEntity>().Push(target, text.Section_id);
            var r1 = await DB.UpdateAsync(f1, u1);
            
            return new ObjectResult(text.Section_id.ToString());
        }
        
        [HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] UpdateDoDontRequest req)
		{
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