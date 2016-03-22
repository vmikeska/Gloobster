using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
	public class WikiSearchController: BaseApiController
	{
	    private const int MaxResults = 10;
             
        public WikiSearchController(ILogger log, IDbOperations db) : base(log, db)
        {
            
        }
        
        [HttpGet]		
		public IActionResult Get(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return new ObjectResult(new object [0]);
            }

            var lquery = query.ToLower();
            var dbResults = DB.C<WikiTextsEntity>()
                .Where(i => i.Title.ToLower().StartsWith(lquery))
                .OrderByDescending(o => o.Rating)
                .ThenBy(o => o.Title)
                .ToList();

            var maxDbResults = dbResults.Take(MaxResults);

            var results = maxDbResults.Select(r => new WikiSearchResult
            {
                id = r.id.ToString(),
                link = r.LinkName,
                language = r.Language,
                title = r.Title,
                articleId = r.Article_id.ToString(),
                rating = r.Rating
            });

            return new ObjectResult(results);
		}
        
	}

    
}