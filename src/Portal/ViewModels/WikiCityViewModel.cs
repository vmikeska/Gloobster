using System;
using System.Collections.Generic;
using Gloobster.Entities;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    

    public class WikiCityViewModel : WikiModelBase
    {        
        public WikiCityEntity Article { get; set; }

        public override List<ArticleDataSE> Data => Article.Data;

        public override List<SectionSE> Sections => Article.Sections;
        public override List<ObjectId> Dos => Article.Dos;
        public override List<ObjectId> Donts => Article.Donts;

        private List<PhotoVM> _photos;
        public List<PhotoVM> Photos => _photos ?? (_photos = ConvertPhotos(Article.Photos, DB));

        public static List<PhotoVM> ConvertPhotos(List<WikiPhotoSE> photos, IDbOperations db)
        {
            var userIds = photos.Select(p => p.Owner_id).Distinct().ToList();
            var users = db.List<UserEntity>(u => userIds.Contains(u.User_id));

            var phts = photos.Select(p =>
            {
                string ownerName = "NotKnown";
                var owner = users.FirstOrDefault(u => u.User_id == p.Owner_id);
                if (owner != null)
                {
                    ownerName = owner.DisplayName;
                }

                var item = new PhotoVM
                {
                    Id = p.id.ToString(),
                    Description = p.Description,
                    OwnerName = ownerName,
                    OwnerId = p.Owner_id.ToString(),
                    Confirmed = p.Confirmed,
                    Inserted = p.Inserted
                };
                return item;
            }).ToList();
            return phts;
        }

        public override List<Breadcrumb> GetBreadcrumb()
        {
            var bc = base.GetBreadcrumb();

            var countryArticle = DB.C<WikiCountryEntity>().FirstOrDefault(i => i.CountryCode == Article.CountryCode);
            var countryTexts = DB.C<WikiTextsEntity>().FirstOrDefault(i => i.Article_id == countryArticle.id && i.Language == Texts.Language);
            

            var contName = GetNameFromContinent(countryArticle.Continent);

            //continent
            //bc.Add(                
            //    new Breadcrumb
            //    {
            //        Id = ((int)countryArticle.Continent).ToString(),
            //        Name = contName,
            //        Link = $"/wiki/{Texts.Language}/{contName}"
            //    }
            //);

            //country
            bc.Add(
                new Breadcrumb
                {
                    Id = countryArticle.id.ToString(),
                    Name = countryTexts.Title,
                    Link = $"/wiki/{Texts.Language}/{countryTexts.LinkName}"
                }
            );

            //city
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
            var coutntryArticle = DB.C<WikiCountryEntity>().FirstOrDefault(c => c.CountryCode == Article.CountryCode);
            var countryText = DB.C<WikiTextsEntity>().FirstOrDefault(c => c.Article_id == coutntryArticle.id);

            var rl = new List<RelatedLink>
            {
                new RelatedLink
                {
                    Name = countryText.Title,
                    Link = $"/wiki/{Texts.Language}/{countryText.LinkName}"
                }
            };
            
            return rl;
        }

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
                Id1 = priceItem.id.ToString(),
                Name = priceItem.Type,
                Price1 = priceItem.Price.CurrentPrice,
                Liked1 = WasLikedPrice(priceItem)
            };
            return res;
        }

        private bool? WasLikedPrice(PriceItemSE price)
        {
            if (string.IsNullOrEmpty(UserId))
            {
                return null;
            }

            var userIdObj = new ObjectId(UserId);

            bool liked = price.Price.Plus.Contains(userIdObj);
            bool disliked = price.Price.Minus.Contains(userIdObj);

            bool? wasLiked = null;
            if (liked)
            {
                wasLiked = true;
            }
            if (disliked)
            {
                wasLiked = false;
            }

            return wasLiked;
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

        public BlockVM Base()
        {
            var block = Section("Base", "standard,base", 3);           
            block.Infos = Info;

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

        private PriceItemSE GetPriceBySubCat(List<PriceItemSE> prices, string subCat)
        {
            return prices.FirstOrDefault(c => c.SubCategory == subCat);
        }

        public BlockVM NightLifePrices()
        {
            var block = Section("NightlifePrices", "strandard,price3", 4);
            var prices = GetPricesByCategory("Nightlife").ToList();
            
            var groups = prices.GroupBy(p => p.Type).ToList();
            
            block.TableItems = groups.Select(i =>
            {
                List<PriceItemSE> items = i.ToList();
                var pub = GetPriceBySubCat(items, "Pub");
                var bar = GetPriceBySubCat(items, "Bar");
                var club = GetPriceBySubCat(items, "Club");

                return new TableItemVM
                {
                    Name = i.Key,

                    Price1 = pub.Price.CurrentPrice,
                    Liked1 = WasLikedPrice(pub),
                    Id1 = pub.id.ToString(),

                    Price2 = bar.Price.CurrentPrice,
                    Liked2 = WasLikedPrice(bar),
                    Id2 = bar.id.ToString(),

                    Price3 = club.Price.CurrentPrice,
                    Liked3 = WasLikedPrice(club),
                    Id3 = club.id.ToString(),
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
    }

    

    public class BlockVM
    {
        public WikiModelBase B { get; set; }

        public int Rating { get; set; }

        public ArticleType ArticleType { get; set; }

        public bool? Liked { get; set; }

        public int Size { get; set; }
        public string Admin { get; set; }

        public string Category { get; set; }
        public string SectionId { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
        public string TranslatedType { get; set; }        
        public List<string> Headers { get; set; }

        public List<TableItemVM> TableItems { get; set; }
        public bool ShowButtons = true;

        public List<LinkVM> LinkItems { get; set; }

        public string GetLinkIco(SourceType type)
        {
            if (type == SourceType.S4)
            {
                return "icon-foursquare";
            }

            if (type == SourceType.FB)
            {
                return "icon-facebook2";
            }
            
            if (type == SourceType.Yelp)
            {
                return "icon-yelp";
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

        public List<InfoItemVM> Infos { get; set; }

        public InfoItemVM InfoByName(string name)
        {
            var info = Infos.FirstOrDefault(i => i.Name == name);            
            return info;
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
        //todo: remove additional "cols"

        public bool? Liked1 { get; set; }
        public bool? Liked3 { get; set; }
        public bool? Liked2 { get; set; }

        public string Id1 { get; set; }
        public string Id2 { get; set; }
        public string Id3 { get; set; }
        public string Name { get; set; }
        public decimal Price1 { get; set; }
        public decimal Price2 { get; set; }
        public decimal Price3 { get; set; }
    }

    public class DoDontsVM
    {
        public List<DdVM> Dos { get; set; }
        public List<DdVM> Donts { get; set; }

        public ViewModelBase B { get; set; }
    }

    public class EmptyVM
    {
        public object Data { get; set; }

        public ViewModelBase B { get; set; }
    }

    public class DdVM
    {
        public string Id { get; set; }
        public string Text { get; set; }

        public bool? Liked { get; set; }

        public ViewModelBase B { get; set; }
    }

    public class PVM
    {
        public bool? Liked { get; set; }

        public ViewModelBase B { get; set; }
    }


    public class PhotosVM
    {
        public string ArticleId { get; set; }
        public List<PhotoVM> Photos { get; set; }
        public bool Admin { get; set; }
        public bool UserIsAdmin { get; set; }
        public ViewModelBase B { get; set; }
    }

    public class PhotoVM
    {
        public string Id { get; set; }
        public string OwnerId { get; set; }
        public string OwnerName { get; set; }
        public bool Confirmed { get; set; }
        public DateTime Inserted { get; set; }
        public string Description { get; set; }
    }


}