using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{
    public class ContentEvaluator : IContentEvaluator
    {
        public IDbOperations DB { get; set; }

        public const int OneStarLength = 60;
        public const int FiveStarLength = 400;
        
        public async Task<double> EvaluateArticle(string articleId)
        {
            var results = new List<double>();

            var articleIdObj = new ObjectId(articleId);            
            var sectionIds = new List<ObjectId>();

            var texts = DB.C<WikiTextsEntity>().FirstOrDefault(t => t.Article_id == articleIdObj);
            
            if (texts.Type == ArticleType.City)
            {
                var city = DB.C<WikiCityEntity>().FirstOrDefault(c => c.id == texts.Article_id);                            
                sectionIds = city.Sections.Select(s => s.id).ToList();
            }
            if (texts.Type == ArticleType.Country)
            {
                var country = DB.C<WikiCountryEntity>().FirstOrDefault(c => c.id == texts.Article_id);
                sectionIds = country.Sections.Select(s => s.id).ToList();
            }
            
            foreach (var textObj in texts.Texts)
            {                
                if (sectionIds.Contains(textObj.Section_id))
                {
                    var text = textObj.Text;
                    if (text.Length > FiveStarLength)
                    {
                        results.Add(5);                        
                    }
                    else if (text.Length < OneStarLength)
                    {
                        results.Add(0);
                    }
                    else
                    {
                        double index = (Convert.ToDouble(text.Length)/Convert.ToDouble(FiveStarLength));
                        double rating = index*5;
                        results.Add(rating);
                    }
                }
            }

            double avg = results.Average(i => i);
            
            var f = DB.F<WikiTextsEntity>().Eq(c => c.Article_id, articleIdObj);
            var u = DB.U<WikiTextsEntity>().Set(c => c.Rating, avg);
            var res =  await DB.UpdateAsync(f, u);
            
            return avg;
        }
    }
}