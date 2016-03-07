using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.DomainModels.Wiki
{
    public class WikiUpdateDomain : IWikiUpdateDomain
    {
        public IDbOperations DB { get; set; }

        public async Task<bool> UpdateBaseSection(string articleId, string sectionId, string language, string newText)
        {
            ObjectId articleIdObj = new ObjectId(articleId);
            ObjectId sectionIdObj = new ObjectId(sectionId);

            var filter = DB.F<WikiTextsEntity>().Eq(p => p.Article_id, articleIdObj) &
                         DB.F<WikiTextsEntity>().Eq(p => p.Language, language) &
                         DB.F<WikiTextsEntity>().Eq("Texts.Section_id", sectionIdObj);

            var update = DB.U<WikiTextsEntity>().Set("Texts.$.Text", newText);
            var res = await DB.UpdateAsync(filter, update);

            return res.ModifiedCount == 1;
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
