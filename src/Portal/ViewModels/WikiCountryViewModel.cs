using System.Collections.Generic;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.Portal.ViewModels
{
    public class PriceItemVM
    {
        public string Type { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }        
        public decimal Price { get; set; }
    }

    public class WikiCountryViewModel : WikiModelBase
    {        
        public WikiCountryEntity Article { get; set; }

        public override List<ArticleDataSE> Data => Article.Data;
        
        private List<PriceItemVM> _aggPrices;
        public List<PriceItemVM> AggPrices => _aggPrices ?? (_aggPrices = GetAggregatedPrices());

        public BlockVM Base()
        {
            var block = Section("Base", "standard,base", 3);
            block.Infos = Info;

            return block;
        }

        public BlockVM Restaurant()
        {
            var block = Section("Restaurant", "standard,price1", 3);
            block.TableItems = GetPricesByCategory("Restaurant").Select(ConvertTableItem).ToList();
            block.ShowButtons = false;

            return block;
        }

        public BlockVM Accommodation()
        {
            var block = Section("Accommodation", "standard,price1", 3);
            block.TableItems = GetPricesByCategory("Accommodation").Select(ConvertTableItem).ToList();
            block.ShowButtons = false;

            return block;
        }

        public BlockVM Transport()
        {
            var block = Section("Transport", "standard,price1", 3);
            block.TableItems = GetPricesByCategory("Transport").Select(ConvertTableItem).ToList();
            block.ShowButtons = false;

            return block;
        }

        public BlockVM NightLifePrices()
        {
            var block = Section("NightlifePrices", "strandard,price3", 4);
            var prices = GetPricesByCategory("Nightlife").ToList();

            var groups = prices.GroupBy(p => p.Type).ToList();

            block.TableItems = groups.Select(i =>
            {
                List<PriceItemVM> items = i.ToList();
                var pub = GetPriceBySubCat(items, "Pub");
                var bar = GetPriceBySubCat(items, "Bar");
                var club = GetPriceBySubCat(items, "Club");

                return new TableItemVM
                {
                    Name = i.Key,

                    Price1 = pub.Price,
                    Price2 = bar.Price,                    
                    Price3 = club.Price,                    
                };
            }).ToList();

            block.Headers = new List<string>
            {
                "Pub",
                "Bar",
                "Club"
            };

            return block;
        }

        public TableItemVM ConvertTableItem(PriceItemVM priceItem)
        {
            var res = new TableItemVM
            {                
                Name = priceItem.Type,
                Price1 = priceItem.Price
            };
            return res;
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

        private List<PriceItemVM> GetAggregatedPrices()
        {
            var allCities = DB.List<WikiCityEntity>(c => c.CountryCode == Article.CountryCode);
            var allPrices = allCities.SelectMany(p => p.Prices).ToList();

            var filteredPrices = FilterSetUnsetPrices(allPrices);

            var groupedItems = filteredPrices
                .GroupBy(p => new {p.Type, p.Category, p.SubCategory})                
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

        public List<PriceItemVM> GetPricesByCategory(string category)
        {
            return AggPrices.Where(p => p.Category == category).ToList();
        }

        private PriceItemVM GetPriceBySubCat(List<PriceItemVM> prices, string subCat)
        {
            return prices.FirstOrDefault(c => c.SubCategory == subCat);
        }

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