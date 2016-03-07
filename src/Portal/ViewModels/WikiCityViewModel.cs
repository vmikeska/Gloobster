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
        public string SectionId { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
        public List<string> Headers { get; set; }
        public List<TableItemVM> TableItems { get; set; }
    }

    public class LinkVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<LinkItemSE> Links { get; set; }
    }

    public class LinksVM
    {
        public string Type { get; set; }

        public List<LinkVM> Items { get; set; }

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
    }
    
    public class TableItemVM
    {
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

        public LinksVM BarDistricts()
        {
            var res = new LinksVM
            {
                Type = "BarDistricts",
                Items = Article.BarDistricts.Select(b => new LinkVM
                {
                    Name = b.Name,
                    Id = b.id.ToString(),
                    Links = b.Links
                }).ToList()                
            };

            return res;
        }
        
        public BlockVM Accommodation()
        {
            var block = Section("Accommodation");
            block.TableItems = Article.AccommodationItems.Select(i => new TableItemVM
            {
                Name = i.Type,
                Price1 = i.Price.CurrentPrice
            }).ToList();

            return block;
        }

        public BlockVM Transport()
        {
            var block = Section("Transport");
            block.TableItems = Article.TransportItems.Select(i => new TableItemVM
            {
                Name = i.Type,
                Price1 = i.Price.CurrentPrice
            }).ToList();

            return block;
        }

        public BlockVM Restaurant()
        {
            var block = Section("Restaurant");
            block.TableItems = Article.RestaurantItems.Select(i => new TableItemVM
            {
                Name = i.Type,
                Price1 = i.Price.CurrentPrice
            }).ToList();

            return block;
        }

        public LinksVM Sights()
        {
            var res = new LinksVM
            {
                Type = "FavoriteSites",
                Items = Article.Sights.Select(b => new LinkVM
                {
                    Name = b.Name,
                    Id = b.id.ToString(),
                    Links = b.Links
                }).ToList()
            };

            return res;
        }
        
        public BlockVM NightLife()
        {
            var block = new BlockVM
            {
                Type = "Prices",
                TableItems = Article.PubItems.Select(i => new TableItemVM
                {
                    Name = i.Type,
                    Price1 = i.PricePub.CurrentPrice,
                    Price2 = i.PriceBar.CurrentPrice,
                    Price3 = i.PriceClub.CurrentPrice
                }).ToList(),
                Headers = new List<string>
                {
                    "Pub", "Bar", "Club"
                }

            };
            return block;
        }        
    }

    
}