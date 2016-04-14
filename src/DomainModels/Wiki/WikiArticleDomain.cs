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
using System.Linq;

namespace Gloobster.DomainModels.Wiki
{
    public class WikiArticleDomain: IWikiArticleDomain
    {
        public IDbOperations DB { get; set; }
        public INiceLinkBuilder LinkBuilder { get; set; }

        public string CreateCity(CityDO city, string lang)
        {
            var cityLink = LinkBuilder.BuildLinkCity(city.AsciiName, city.CountryCode, city.GID);
            
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
            builder.AddSection("Surfing", "No content");

            article.Links.Add(new LinkSE
            {
                Type = LinkType.Geonames,
                id = ObjectId.GenerateNewId(),
                Link = string.Empty,
                SID = city.GID.ToString()
            });

            article.GID = city.GID;

            article.Data = new List<ArticleDataSE>
            {
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "PopulationCity",
                    Value = city.Population.ToString(),
                    DataType = ArticleDataType.Int
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "PopulationMetro",
                    Value = null,
                    DataType = ArticleDataType.Int
                },                
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

        //private bool IsRightDriving(string countryCode)
        //{
        //    var countries = new[] {"uk", "sr", "gy", "", "", "", "", "", "", "", "", "", "", "", "", "", "" };
        //    if (countries.Contains(countryCode))
        //    {
        //        return false;
        //    }

        //    return true;
        //}

        public string CreateCountry(Continent continent, string countryCode, string name, string lang, 
            int capitalGID, string capitalName)
        {
            var linkId = LinkBuilder.BuildBasicLink(name);

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
            builder.AddSection("Restaurant", "No content");
            builder.AddSection("Tipping", "No content");
            builder.AddSection("Accommodation", "No content");
            builder.AddSection("NightLife", "No content");
            builder.AddSection("NightlifePrices", "No content");

            article.Links.Add(new LinkSE
            {
                Type = LinkType.Geonames,
                id = ObjectId.GenerateNewId(),
                Link = string.Empty,
                SID = PH.GID(countryData)
            });

            article.GID = int.Parse(PH.GID(countryData));

            article.Data = new List<ArticleDataSE>
            {
                //todo: http://www.sitepoint.com/web-foundations/iso-2-letter-language-codes/
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "Languages",
                    Values = PH.Languages(countryData),
                    DataType = ArticleDataType.String,
                    ListCategory = "Languages"
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "Population",
                    Value = PH.Population(countryData).ToString(),
                    DataType = ArticleDataType.Int                    
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "Area",
                    Value = PH.Area(countryData).ToString(),
                    DataType = ArticleDataType.Int
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "CapitalId",
                    Value = capitalGID.ToString(),
                    DataType = ArticleDataType.Int
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "CapitalName",
                    Value = capitalName,
                    DataType = ArticleDataType.String
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "CurrencyCode",
                    Value = PH.Currency(countryData),
                    DataType = ArticleDataType.String,                    
                },
                //todo: http://www.worldstandards.eu/cars/list-of-left-driving-countries/
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "DrivingRight",
                    Value = true.ToString(),
                    DataType = ArticleDataType.Bool,
                },
                //todo: https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "HDI",
                    Value = "2",
                    DataType = ArticleDataType.Int,
                    ListCategory = "HDI"
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "MemberOf",
                    Values = new List<string>(),
                    DataType = ArticleDataType.Int,
                    ListCategory = "Organizations"
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "Religion",
                    Values = new List<string>(),
                    DataType = ArticleDataType.Int,
                    ListCategory = "Religions"
                },
                //todo: http://www.worldstandards.eu/electricity/plug-voltage-by-country/
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "Socket",
                    Values = new List<string>(),
                    DataType = ArticleDataType.Int,
                    ListCategory = "Sockets"
                },
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "CallingCode",
                    Value = "",
                    DataType = ArticleDataType.String                    
                }
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
        
        private T CreateArticleBase<T>() where T : WikiArticleBaseEntity, new()
        {
            var entity = new T
            {
                id = ObjectId.GenerateNewId(),
                Photos = new List<WikiPhotoSE>(),                
                HasTitlePhoto = false,
                Links = new List<LinkSE>(),
                Sections = new List<SectionSE>(),                
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
                    CurrentPrice = 1,
                    DefaultPrice = 1,
                    Plus = new List<ObjectId>(),
                    Minus = new List<ObjectId>(),
                    Initialized = false
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
                Texts = new List<SectionTextsSE>(),
                Created = DateTime.UtcNow,
                Updated = null,
                Rating = 0
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