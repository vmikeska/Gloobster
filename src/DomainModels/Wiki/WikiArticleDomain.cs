using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{    
    public class WikiArticleDomain: IWikiArticleDomain
    {
        public IDbOperations DB { get; set; }
        
        public string CreateCity(CityDO city, string lang)
        {
            var cityLink = NiceLinkBuilder.BuildLink(city.AsciiName);
            
            var builder = new ArticleBuilder();
            builder.InitCity(city.CountryCode);
            builder.InitTexts(lang, city.AsciiName, cityLink);
            var article = (WikiCityEntity)builder.Article;
            
            builder.AddSection("Base", "No content");
            builder.AddSection("BarDistricts", "No content");
            builder.AddSection("FavoriteSites", "No content");
            builder.AddSection("AboutPeople", "No content");
            builder.AddSection("NightLife", "No content");
            builder.AddSection("NightlifePrices", "No content");
            builder.AddSection("Transport", "No content");
            builder.AddSection("Accommodation", "No content");
            builder.AddSection("Tipping", "No content");
            builder.AddSection("Restaurant", "No content");
            
            article.Links.Add(new LinkSE
            {
                Type = LinkType.Geonames,
                id = ObjectId.GenerateNewId(),
                Link = string.Empty,
                SID = city.GID.ToString()
            });

            article.Data = new CityDataSE
            {                
                PopulationCity = city.Population
            };

            builder.AddPrice("Taxi", "Transport");
            builder.AddPrice("PublicTransport", "Transport");

            builder.AddPrice("Salad", "Restaurant");            
            builder.AddPrice("Steak", "Restaurant");            
            builder.AddPrice("Local", "Restaurant");
            builder.AddPrice("Pizza", "Restaurant");
            
            builder.AddPrice("Hostel", "Accommodation");            
            builder.AddPrice("Star3", "Accommodation");            
            builder.AddPrice("Star4", "Accommodation");

            //nightlife
            builder.AddPrice("Beer", "Nightlife", "Pub");
            builder.AddPrice("Beer", "Nightlife", "Bar");
            builder.AddPrice("Beer", "Nightlife", "Club");

            builder.AddPrice("Wine", "Nightlife", "Pub");
            builder.AddPrice("Wine", "Nightlife", "Bar");
            builder.AddPrice("Wine", "Nightlife", "Club");

            builder.AddPrice("Whiskey", "Nightlife", "Pub");
            builder.AddPrice("Whiskey", "Nightlife", "Bar");
            builder.AddPrice("Whiskey", "Nightlife", "Club");

            builder.AddPrice("Vodka", "Nightlife", "Pub");
            builder.AddPrice("Vodka", "Nightlife", "Bar");
            builder.AddPrice("Vodka", "Nightlife", "Club");

            builder.AddPrice("Cigarettes", "Nightlife", "Pub");
            builder.AddPrice("Cigarettes", "Nightlife", "Bar");
            builder.AddPrice("Cigarettes", "Nightlife", "Club");
            
            builder.Save<WikiCityEntity>(DB);
            
            return article.id.ToString();
        }


        public string CreateCountry(Continent continent, string countryCode, string name, string lang, 
            int capitalGID, string capitalName)
        {
            var linkId = NiceLinkBuilder.BuildLink(name);

            var countryInfo = GNHelper.GetCountryInfo(countryCode);
            var countryData = countryInfo.geonames[0];

            var builder = new ArticleBuilder();
            builder.InitCountry(continent, countryCode);
            builder.InitTexts(lang, name, linkId);
            var article = (WikiCountryEntity)builder.Article;

            builder.AddSection("Base", "No content");
            builder.AddSection("AboutPeople", "No content");
            builder.AddSection("Languages", "No content");
            builder.AddSection("Safety", "No content");
            builder.AddSection("Marihuana", "No content");
            builder.AddSection("Gay", "No content");
            builder.AddSection("Transport", "No content");
            builder.AddSection("Restaurants", "No content");
            builder.AddSection("Tipping", "No content");
            builder.AddSection("Accommodation", "No content");

            article.Links.Add(new LinkSE
            {
                Type = LinkType.Geonames,
                id = ObjectId.GenerateNewId(),
                Link = string.Empty,
                SID = PH.GID(countryData)
            });
            
            article.Data = new CountryDataSE
            {             
                Languages = PH.Languages(countryData),
                Population = PH.Population(countryData),
                Area = PH.Area(countryData),
                CallingCode = "---",
                CapitalId = capitalGID,
                CapitalName = capitalName,
                CurrencyCode = PH.Currency(countryData),
                CurrencyName = PH.Currency(countryData),
                //todo: http://www.worldstandards.eu/cars/list-of-left-driving-countries/
                DrivingRight = true,
                //todo: https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index
                HDI = HDI.NA,
                MemberOf = new List<string>(),
                //todo:
                Religion = ReligionType.NA,
                //todo: 
                SocketType = SocketType.NA
            };

            builder.Save<WikiCountryEntity>(DB);
            
            return article.id.ToString();
        }        
    }

    public class ArticleBuilder
    {
        public WikiArticleBaseEntity Article;
        public WikiTextsEntity Texts;

        private ArticleType _articleType;

        public ArticleBuilder()
        {

        }
        
        private T CreateArticleBase<T>() where T : WikiArticleBaseEntity, new()
        {
            var entity = new T
            {
                id = ObjectId.GenerateNewId(),
                Photos = new List<WikiPhotoSE>(),
                Created = DateTime.UtcNow,
                HasTitlePhoto = false,
                Links = new List<LinkSE>(),
                Sections = new List<SectionSE>(),
                Updated = null
            };

            return entity;
        }

        public void AddPrice(string type, string category, string subCategory = "")
        {
            var item = new PriceItemSE
            {
                id = ObjectId.GenerateNewId(),
                Type = type,
                Category = category,
                SubCategory = subCategory,
                Price = new PriceSE
                {
                    CurrentPrice = 0,
                    DefaultPrice = 0,
                    Plus = new List<ObjectId>(),
                    Minus = new List<ObjectId>()
                }
            };

            ((WikiCityEntity)Article).Prices.Add(item);
        }

        public void InitCity(string countryCode)
        {
            Article = CreateArticleBase<WikiCityEntity>();
            var a = (WikiCityEntity)Article;
            a.Dos = new List<ObjectId>();
            a.Donts = new List<ObjectId>();
            a.Prices = new List<PriceItemSE>();
            a.PlacesLinks = new List<LinkObjectSE>();
            a.CountryCode = countryCode;

            _articleType = ArticleType.City;
        }

        public void InitCountry(Continent continent, string countryCode)
        {
            Article = CreateArticleBase<WikiCountryEntity>();
            var a = (WikiCountryEntity)Article;
            a.CountryCode = countryCode;
            a.Dos = new List<ObjectId>();
            a.Donts = new List<ObjectId>();

            _articleType = ArticleType.Country;
        }

        public void InitTexts(string lang, string title, string linkName)
        {
            Texts = new WikiTextsEntity
            {
                id = ObjectId.GenerateNewId(),
                Article_id = Article.id,
                Language = lang,
                Title = title,
                LinkName = linkName,
                Type = _articleType,
                Texts = new List<SectionTextsSE>()
            };
        }

        public void AddSection(string type, string text)
        {
            var id = ObjectId.GenerateNewId();

            var sectionText = new SectionTextsSE
            {
                Text = text,
                Dislikes = new List<ObjectId>(),
                Likes = new List<ObjectId>(),
                Section_id = id
            };

            var section = new SectionSE
            {
                id = id,
                Type = type
            };

            Article.Sections.Add(section);

            Texts.Texts.Add(sectionText);
        }

        public void Save<T>(IDbOperations db) where T : WikiArticleBaseEntity
        {
            db.SaveAsync((T)Article);
            db.SaveAsync(Texts);
        }
    }
}