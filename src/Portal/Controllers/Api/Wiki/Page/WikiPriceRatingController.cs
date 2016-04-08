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

namespace Gloobster.Portal.Controllers.Api.Wiki
{
	public class WikiPriceRatingController: BaseApiController
	{
        public IWikiUpdateDomain WikiUpdate { get; set; }

        public WikiPriceRatingController(IWikiUpdateDomain wikiUpdate, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiUpdate = wikiUpdate;
        }
		
		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] WikiRatingRequest req)
		{
		    if (IsConfirmedRegistration)
		    {
		        var priceId = req.sectionId;
		        bool plus = req.like;

		        decimal newPrice = await WikiUpdate.AddPriceRating(req.articleId, priceId, UserId, plus);
                return new ObjectResult(newPrice);
            }
            return new ObjectResult(null);
        }
        
	}
}