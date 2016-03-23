using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.DomainModels.Wiki
{
    public class WikiUpdateDomain : IWikiUpdateDomain
    {
        public IDbOperations DB { get; set; }
        public IWikiChangeDomain ChangeEventSystem { get; set; }
        public IContentEvaluator ContentEvaluator { get; set; }

        public async Task<bool> UpdateBaseSection(string articleId, string sectionId, string language, string newText)
        {
            var articleIdObj = new ObjectId(articleId);
            var sectionIdObj = new ObjectId(sectionId);

            var filter = DB.F<WikiTextsEntity>().Eq(p => p.Article_id, articleIdObj) &
                         DB.F<WikiTextsEntity>().Eq(p => p.Language, language) &
                         DB.F<WikiTextsEntity>().Eq("Texts.Section_id", sectionIdObj);

            var update = DB.U<WikiTextsEntity>().Set("Texts.$.Text", newText);
            var res = await DB.UpdateAsync(filter, update);

            var update2 = DB.U<WikiTextsEntity>().Set(e => e.Updated, DateTime.UtcNow);
            var res2 = await DB.UpdateAsync(filter, update2);

            bool updated = res.ModifiedCount == 1;
            if (updated)
            {
                var evnt = new WikiEventDO
                {
                    ArticleId = articleId,
                    Lang = language,
                    Value = newText,
                    EventType = EventType.Update,
                    AddId = sectionId                    
                };
                ChangeEventSystem.ReceiveEvent(evnt);
            }

            await ContentEvaluator.EvaluateArticle(articleId);

            return res.ModifiedCount == 1;
        }

        public async Task<decimal> AddPriceRating(string articleId, string priceId, string userId, bool plus)
        {
            ObjectId articleIdObj = new ObjectId(articleId);
            ObjectId priceIdObj = new ObjectId(priceId);
            ObjectId userIdObj = new ObjectId(userId);
            
            var prices = DB.C<WikiCityEntity>()
                .Where(c => c.id == articleIdObj)
                .Select(c => c.Prices)
                .First();

            var price = prices.First(p => p.id == priceIdObj).Price;
            
            //unrate first if rated
            price.Minus.Remove(userIdObj);
            price.Plus.Remove(userIdObj);

            if (plus)
            {                
                price.Plus.Add(userIdObj);
            }
            else
            {
                price.Minus.Add(userIdObj);                
            }

            price.CurrentPrice = RecalculatePrices(price.DefaultPrice, price.Plus.Count, price.Minus.Count);
            
            var filter =
                DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj) &
                DB.F<WikiCityEntity>().Eq("Prices.id", priceIdObj);

            var update = DB.U<WikiCityEntity>().Set("Prices.$.Price", price);
            var res = await DB.UpdateAsync(filter, update);

            return price.CurrentPrice;
        }

        private decimal RecalculatePrices(decimal defaultPrice, int plusCnt, int minusCnt)
        {
            decimal onePercent = defaultPrice/100;

            if (plusCnt > minusCnt)
            {
                int cnt = plusCnt - minusCnt;
                decimal newVal = defaultPrice + (onePercent*cnt);
                return newVal;
            }

            if (minusCnt > plusCnt)
            {
                var cnt = minusCnt - plusCnt;
                decimal newVal = defaultPrice - (onePercent * cnt);
                return newVal;
            }

            return defaultPrice;
        }

        public async Task<bool> AddRating(string articleId, string sectionId, string language, string userId, bool like)
        {
            ObjectId articleIdObj = new ObjectId(articleId);
            ObjectId sectionIdObj = new ObjectId(sectionId);
            ObjectId userIdObj = new ObjectId(userId);

            var filter = RatingFilter(articleIdObj, sectionIdObj, language);

            //unrate first if rated
            var u1 = DB.U<WikiTextsEntity>().Pull(RatingObjName(true), userIdObj);
            var r1 = await DB.UpdateAsync(filter, u1);
            var u2 = DB.U<WikiTextsEntity>().Pull(RatingObjName(false), userIdObj);
            var r2 = await DB.UpdateAsync(filter, u2);
            
            var update = DB.U<WikiTextsEntity>().Push(RatingObjName(like), userIdObj);
            var res = await DB.UpdateAsync(filter, update);

            return res.ModifiedCount == 1;
        }
        
        private string RatingObjName(bool like)
        {
            string objName = like ? "Texts.$.Likes" : "Texts.$.Dislikes";
            return objName;
        }
        
        private FilterDefinition<WikiTextsEntity> RatingFilter(ObjectId articleIdObj, ObjectId sectionIdObj, string language)
        {
            FilterDefinition<WikiTextsEntity> filter = DB.F<WikiTextsEntity>().Eq(p => p.Article_id, articleIdObj) &
                         DB.F<WikiTextsEntity>().Eq(p => p.Language, language) &
                         DB.F<WikiTextsEntity>().Eq("Texts.Section_id", sectionIdObj);

            return filter;
        }
    }
}
