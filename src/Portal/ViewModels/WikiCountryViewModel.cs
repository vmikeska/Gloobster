using System.Collections.Generic;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.Portal.ViewModels
{
    public class WikiCountryViewModel : WikiModelBase
    {        
        public WikiCountryEntity Article { get; set; }
        
        public override List<SectionSE> Sections => Article.Sections;
        public override List<ObjectId> Dos => Article.Dos;
        public override List<ObjectId> Donts => Article.Donts;

        public override List<Breadcrumb> GetBreadcrumb()
        {
            var bc = base.GetBreadcrumb();
            
            var contName = GetNameFromContinent(Article.Continent);

            //continent
            //bc.Add(
            //    new Breadcrumb
            //    {
            //        Id = ((int)Article.Continent).ToString(),
            //        Name = contName,
            //        Link = $"/wiki/{Texts.Language}/{contName}"
            //    }
            //);

            //country
            bc.Add(
                new Breadcrumb
                {
                    Id = Article.id.ToString(),
                    Name = Texts.Title,
                    Link = $"/wiki/{Texts.Language}/{Texts.LinkName}"
                }
            );

            return bc;
        }

        public override List<RelatedLink> GetRelatedLinks()
        {
            var rl = new List<RelatedLink>();

            var citiesArticles = DB.C<WikiCityEntity>()
                .Where(c => c.CountryCode == Article.CountryCode)
                .ToList();
            var citiesIds = citiesArticles
                .Select(c => c.id)
                .ToList();
            
            var citiesTexts = DB.C<WikiTextsEntity>()
                .Where(c => citiesIds.Contains(c.Article_id) && c.Language == Texts.Language)
                .ToList();
            
            foreach (var city in citiesTexts)
            {
                var link = new RelatedLink
                {
                    Name = city.Title,
                    Link = $"/wiki/{Texts.Language}/{city.LinkName}"
                };
                rl.Add(link);
            }
            

            return rl;
        }
    }
}