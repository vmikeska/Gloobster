using System.Collections.Generic;
using Gloobster.Entities;
using System.Linq;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public class BlockVM
    {
        public int Size { get; set; }
        public string Admin { get; set; }

        public string Category { get; set; }
        public string SectionId { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
        public List<string> Headers { get; set; }
        public List<TableItemVM> TableItems { get; set; }

        public List<LinkVM> LinkItems { get; set; }

        public string GetLinkIco(SourceType type)
        {
            if (type == SourceType.S4)
            {
                return "disc-foursquare";
            }
            if (type == SourceType.FB)
            {
                return "disc-facebook";
            }
            //todo: change
            if (type == SourceType.Yelp)
            {
                return "disc-google";
            }

            return string.Empty;
        }

        public string GetLink(SourceType type, string sid)
        {
            var template = "";

            if (type == SourceType.S4)
            {
                template = "https://foursquare.com/v/{0}";
            }
            if (type == SourceType.FB)
            {
                template = "https://www.facebook.com/{0}";
            }
            if (type == SourceType.Yelp)
            {
                template = "https://www.yelp.com/biz/{0}";
            }
            
            return string.Format(template, sid);
        }
    }

    public class LinkVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<LinkItemSE> Links { get; set; }
    }

    
    
    public class TableItemVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Price1 { get; set; }
        public decimal Price2 { get; set; }
        public decimal Price3 { get; set; }
    }

    public class DoDontsVM
    {
        public List<DdVM> Dos { get; set; }
        public List<DdVM> Donts { get; set; }
    }

    public class DdVM
    {        
        public string Id { get; set; }
        public string Text { get; set; }
    }


    public class WikiCityViewModel : WikiModelBase
    {        
        public WikiCityEntity Article { get; set; }

        public override List<SectionSE> Sections => Article.Sections;
        public override List<ObjectId> Dos => Article.Dos;
        public override List<ObjectId> Donts => Article.Donts;

        public List<LinkObjectSE> GetLinksByCategory(string category)
        {
            var links = Article.PlacesLinks.Where(c => c.Category == category).ToList();
            return links;
        }

        public List<PriceItemSE> GetPricesByCategory(string category)
        {
            return Article.Prices.Where(p => p.Category == category).ToList();
        }

        public TableItemVM ConvertTableItem(PriceItemSE priceItem)
        {
            var res = new TableItemVM
            {
                Id = priceItem.id.ToString(),
                Name = priceItem.Type,
                Price1 = priceItem.Price.CurrentPrice
            };
            return res;
        }

        public BlockVM BarDistricts()
        {
            var cat = "BarDistricts";

            var block = Section("BarDistricts", "links");
            var links = GetLinksByCategory(cat);
            block.Category = cat;
            block.LinkItems = links.Select(b => new LinkVM
            {
                Name = b.Name,
                Id = b.id.ToString(),
                Links = b.Links
            }).ToList();
            
            return block;
        }

        public BlockVM Sights()
        {
            var cat = "Sights";

            var block = Section("FavoriteSites", "links");
            var links = GetLinksByCategory(cat);
            block.Category = cat;
            block.LinkItems = links.Select(b => new LinkVM
            {
                Name = b.Name,
                Id = b.id.ToString(),
                Links = b.Links
            }).ToList();

            return block;
        }

        public BlockVM Accommodation()
        {
            var block = Section("Accommodation", "standard,price1", 3);
            block.TableItems =  GetPricesByCategory("Accommodation").Select(ConvertTableItem).ToList();

            return block;
        }

        public BlockVM Transport()
        {
            var block = Section("Transport", "standard,price1", 3);
            block.TableItems = GetPricesByCategory("Transport").Select(ConvertTableItem).ToList();

            return block;
        }

        public BlockVM Restaurant()
        {
            var block = Section("Restaurant", "standard,price1", 3);
            block.TableItems = GetPricesByCategory("Restaurant").Select(ConvertTableItem).ToList();

            return block;
        }

        
        
        public BlockVM NightLifePrices()
        {
            var block = Section("NightlifePrices", "strandard,price3", 4);
            block.TableItems = Article.PubItems.Select(i => new TableItemVM
            {
                Name = i.Type,
                Price1 = i.PricePub.CurrentPrice,
                Price2 = i.PriceBar.CurrentPrice,
                Price3 = i.PriceClub.CurrentPrice
            }).ToList();
            block.Headers = new List<string>
            {
                "Pub",
                "Bar",
                "Club"
            };
            
            return block;
        }        
    }

    
}