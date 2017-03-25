using System.Collections.Generic;
using System.Linq;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;

namespace Gloobster.Portal.ViewModels
{
    public class WikiCountryViewModel : WikiModelBase
    {
        protected override List<string> OrderPreference => new List<string>
        {
            "Base",
            "About", //spec            
            "AboutPeople",
            "Photos", //spec
            "Accommodation",
            "Languages",
            "Safety",
            "Transport",
            
            "Restaurant",
            "OtherPrices", //spec
            "Alcohol",
            "NightLife",
            "NightLifePrices", //spec
            "Tipping",

            "Marihuana",
            "Gay",

            "Hitchhiking",

            "Internet",
            "SimCards"
        };

        public override Table1ViewModel GetPricesByCategory(string category, string subCategory = null)
        {
            List<PriceItemVM> categoryPrices = AggPrices.Where(p => p.Category == category && (subCategory == null || p.SubCategory == subCategory)).ToList();

            var catPrices = categoryPrices.Select(cp => new TableItemVM
            {
                Name = cp.Type,
                Price1 = cp.Price                
            }).ToList();

            var htmlId = $"lb{category}";
            if (!string.IsNullOrEmpty(subCategory))
            {
                htmlId += subCategory;
            }

            var res = new Table1ViewModel
            {
                Type = Texts.Type,
                B = this,
                ShowButtons = false,
                TableItems = catPrices,
                HtmlId = htmlId,

                Title = category, //todo: WORD
                SubTitle = subCategory //todo: WORD
            };

            return res;
        }

        private List<PriceItemVM> _aggPrices;
        public List<PriceItemVM> AggPrices => _aggPrices ?? (_aggPrices = GetAggregatedPrices());

        public override List<Breadcrumb> GetBreadcrumb()
        {
            var bc = base.GetBreadcrumb();

            //var contName = GetNameFromContinent(Article.Continent);
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
                    Id = ArticleId,
                    Name = Texts.Title,
                    Link = $"/wiki/{Texts.Language}/{Texts.LinkName}"
                }
            );

            return bc;
        }

        private List<PriceItemVM> GetAggregatedPrices()
        {
            var allCities = DB.List<WikiCityEntity>(c => c.CountryCode == CountryCode);
            var allPrices = allCities.SelectMany(p => p.Prices).ToList();

            var filteredPrices = FilterSetUnsetPrices(allPrices);

            var groupedItems = filteredPrices
                .GroupBy(p => new { p.Type, p.Category, p.SubCategory })
                .ToList();

            var aggPrices = groupedItems.Select(g =>
                {
                    var items = g.ToList();
                    var fi = items.First();

                    return new PriceItemVM
                    {
                        Category = fi.Category,
                        Type = fi.Type,
                        SubCategory = fi.SubCategory,
                        Price = items.Average(i => i.Price.CurrentPrice)
                    };
                })
                .ToList();

            return aggPrices;
        }

        private List<PriceItemSE> FilterSetUnsetPrices(List<PriceItemSE> prices)
        {
            var groupedItems = prices
                .GroupBy(p => new { p.Type, p.Category, p.SubCategory })
                .ToList();

            var outPrices = new List<PriceItemSE>();

            foreach (var group in groupedItems)
            {
                var items = group.ToList();

                //has initialized price, this price is for us most accurate, so take just initialized ones
                var initPrices = items.Where(i => i.Price.Initialized).ToList();
                if (initPrices.Any())
                {
                    outPrices.AddRange(initPrices);
                }
                else
                {
                    //if has any rated prices, take just rated prices, these are second most trustable for us
                    var ratedPrices = items.Where(i => i.Price.Minus.Any() || i.Price.Plus.Any()).ToList();
                    if (ratedPrices.Any())
                    {
                        outPrices.AddRange(ratedPrices);
                    }
                    else
                    {
                        //using just default values (takes just first, coz default should be same for entire country)
                        outPrices.Add(items.First());
                    }
                }
            }

            return outPrices;
        }

        public override List<RelatedLink> GetRelatedLinks()
        {
            var rl = new List<RelatedLink>();

            var citiesIds = DB
                .C<WikiCityEntity>()
                .Where(c => c.CountryCode == CountryCode)
                .Select(a => a.id)
                .ToList();

            //rating evaluation didn't work
            //var citiesTexts = DB.List<WikiTextsEntity>(c => citiesIds.Contains(c.Article_id) && c.Language == Texts.Language && c.Rating > 0.0);

            var texts = DB.C<WikiTextsEntity>()
                .Where(c => citiesIds.Contains(c.Article_id) && c.Language == Texts.Language)
                .Select(a => new { a.Rating, a.Title, a.LinkName })
                .ToList();
            var ratedTexts = texts.Where(t => t.Rating > 0);

            foreach (var city in ratedTexts)
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