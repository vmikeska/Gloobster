using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
	public class WikiRatingController: BaseApiController
	{
        public IWikiUpdateDomain WikiUpdate { get; set; }

        public WikiRatingController(IWikiUpdateDomain wikiUpdate, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiUpdate = wikiUpdate;
        }
		
		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] WikiRatingRequest req)
		{
		    int? newRating = null;
            
            if (IsConfirmedRegistration)
		    {
		        newRating = await WikiUpdate.AddRating(req.articleId, req.sectionId, req.language, UserId, req.like);
		    }
		    
		    return new ObjectResult(newRating);
		}
        
	}
}