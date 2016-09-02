using System.Collections.Generic;
using System.Linq;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;

namespace Gloobster.Portal.ViewModels
{
    public class WikiHomeViewModel : ViewModelBase
    {
        public List<ArticleVM> Articles { get; set; }

        public List<WikiCityEntity> Cities { get; set; }
        public List<WikiTextsEntity> Texts { get; set; }

        public void LoadArticles()
        {
            //prague 3067696
            //paris 2988507
            //dublin 2964574
            //vienna 2761369
            //lisboa 2267057

            var gids = new[] { 3067696, 2988507, 2964574, 2761369, 2267057 };

            var articles = DB.List<WikiCityEntity>(c => gids.Contains(c.GID));
            var aids = articles.Select(a => a.id);

            Texts = DB.List<WikiTextsEntity>(t => aids.Contains(t.Article_id));
            Cities = articles;

            Articles = new List<ArticleVM>();

            foreach (var city in Cities)
            {
                var text = TextById(city.GID);
                var baseSection = SectionText(text, "Base");

                var article = new ArticleVM
                {
                    GID = city.GID,
                    Title = text.Title,
                    About = baseSection.Text,
                    Link = text.LinkName,
                    Rating = text.Rating
                };

                Articles.Add(article);
            }
        }

        public WikiTextsEntity TextById(int gid)
        {
            var city = Cities.FirstOrDefault(c => c.GID == gid);
            return Texts.FirstOrDefault(t => t.Article_id == city.id);
        }

        public SectionTextsSE SectionText(WikiTextsEntity textEntity, string sectionName)
        {
            var city = Cities.FirstOrDefault(c => c.id == textEntity.Article_id);
            
            var sect = city.Sections.FirstOrDefault(s => s.Type == sectionName);

            SectionTextsSE textSection = textEntity.Texts.FirstOrDefault(t => t.Section_id == sect.id);
            return textSection;
        }


        public List<List<CountryLink>> GetCountryLinks()
        {
            var countries = DB.List<WikiCountryEntity>();
            var ids = countries.Select(c => c.id);
            var texts = DB.List<WikiTextsEntity>(t => ids.Contains(t.Article_id));
            
            var height = (countries.Count/4);
            if ((countries.Count%4) > 0)
            {
                height++;
            }

            var flatRes = texts.Select(t => new CountryLink {Title = t.Title, Link = t.LinkName}).ToList();
            List<List<CountryLink>> groupedRes = flatRes.SplitBy(height);
            return groupedRes;
        }

    }

    public class CountryLink
    {
        public string Title { get; set; }
        public string Link { get; set; }
    }

    public class ArticleVM
    {
        public int GID { get; set; }
        public string Title { get; set; }
        public string About { get; set; }
        public string Link { get; set; }
        public double Rating { get; set; }
    }
}