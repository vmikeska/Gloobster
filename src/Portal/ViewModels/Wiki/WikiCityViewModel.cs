using System.Collections.Generic;
using System.Linq;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public class WikiCityViewModel : WikiModelBase
    {
        public List<PriceItemSE> Prices { get; set; }

        

        protected override List<string> OrderPreference => new List<string>
        {
            "Base",
            "AboutPeople",
            "About", //spec            
            "Accommodation",
            "Photos", //spec
            "Safety",
            "BarDistricts",
            "Transport",
            "NightLife",
            "NightLifePrices", //spec
            "Restaurant",
            
            "OtherPrices", //spec
            "DosDonts", //spec

            "FavoriteSites",
            
            "MuseumsAndTheater",
            "Sport",
        };

        public override List<RelatedLink> GetRelatedLinks()
        {
            var coutntryArticle = DB.FOD<WikiCountryEntity>(c => c.CountryCode == CountryCode);
            var countryText = DB.FOD<WikiTextsEntity>(c => c.Article_id == coutntryArticle.id);

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

        public override Table1ViewModel GetPricesByCategory(string category, string subCategory = null)
        {
            List<PriceItemSE> categoryPrices = Prices.Where(p => p.Category == category && (subCategory == null || p.SubCategory == subCategory )).ToList();

            List<TableItemVM> prices = categoryPrices.Select(ConvertTableItem).ToList();

            var htmlId = $"lb{category}";
            if (!string.IsNullOrEmpty(subCategory))
            {
                htmlId += $"-{subCategory}";
            }

            var res = new Table1ViewModel {
                Type = Texts.Type,
                B = this,
                ShowButtons = true,
                TableItems = prices,

                HtmlId = htmlId,

                Title = category, //todo: WORD
                SubTitle = subCategory //todo: WORD
            };

            return res;
        }

        private TableItemVM ConvertTableItem(PriceItemSE priceItem)
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

        public override List<Breadcrumb> GetBreadcrumb()
        {
            var bc = base.GetBreadcrumb();

            var countryArticle = DB.FOD<WikiCountryEntity>(i => i.CountryCode == CountryCode);
            var countryTexts = DB.FOD<WikiTextsEntity>(i => i.Article_id == countryArticle.id && i.Language == Texts.Language);


            //var contName = GetNameFromContinent(countryArticle.Continent);
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
                    Id = ArticleId,
                    Name = Texts.Title,
                    Link = $"/wiki/{Texts.Language}/{Texts.LinkName}"
                }
            );

            return bc;
        }
        
        
    }
}