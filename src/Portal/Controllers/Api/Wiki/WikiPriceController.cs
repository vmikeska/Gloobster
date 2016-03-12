using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class WikiPriceController : BaseApiController
    {
        public WikiPriceController(ILogger log, IDbOperations db) : base(log, db)
        {

        }
        
        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] UpdatePriceRequest req)
        {
            var articleIdObj = new ObjectId(req.articleId);            
            var idObj = new ObjectId(req.priceId);

            var newPrice = new PriceSE
            {
                CurrentPrice = req.price,
                DefaultPrice = req.price,
                Minus = new List<ObjectId>(),
                Plus = new List<ObjectId>()
            };

            var f1 = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj)
                     & DB.F<WikiCityEntity>().Eq("Prices.id", idObj);                     
            var u1 = DB.U<WikiCityEntity>().Set("Prices.$.Price", newPrice);
            var r1 = await DB.UpdateAsync(f1, u1);

            bool updated = r1.ModifiedCount == 1;
            return new ObjectResult(updated);
        }

    }
}