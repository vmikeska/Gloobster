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

        public List<string> CitySecions()
        {
            return new List<string>
            {
                "Base",
                "BarDistricts",
                "FavoriteSites",
                "AboutPeople",
                "NightLife",
                "NightlifePrices",
                "Transport",
                "Accommodation",
                "Tipping",
                "Restaurant",

                "Surfing",


                "Safety",
                "MuseumsAndTheater",
                "Sport"
            };
        }

        public List<string> CountrySecions()
        {
            return new List<string>
            {
               "Base", 
               "AboutPeople", 
               "Languages", 
               "Safety", 
               "Marihuana", 
               "Gay", 
               "Transport", 
               "Restaurant",
               "Tipping", 
               "Accommodation", 
               "NightLife", 
               "NightlifePrices",

               "Internet", 
               "SimCards",

               "Hitchhiking"
            };
        }

        public async Task CreateMissingSections()
        {
            var countries = DB.List<WikiCountryEntity>();
            var sectionsCountry = CountrySecions();
            foreach (var country in countries)
            {
                foreach (var section in sectionsCountry)
                {
                    bool alreadyHas = country.Sections.Any(s => s.Type == section);
                    if (alreadyHas)
                    {
                        continue;
                    }

                    await CreateSection<WikiCountryEntity>(country.id, section, "No content");
                }

                Console.WriteLine(country.CountryCode);
            }

            var cities = DB.List<WikiCityEntity>();
            var sectionsCity = CitySecions();
            foreach (var city in cities)
            {
                foreach (var section in sectionsCity)
                {
                    bool alreadyHas = city.Sections.Any(s => s.Type == section);
                    if (alreadyHas)
                    {
                        continue;
                    }

                    await CreateSection<WikiCityEntity>(city.id, section, "No content");
                }

                Console.WriteLine(city.GID);
            }            
        }

        private async Task CreateSection<T>(ObjectId id, string type, string text) where T : WikiArticleBaseEntity
        {
            var newSectId = ObjectId.GenerateNewId();

            var sectionText = new SectionTextsSE
            {
                Text = text,
                Dislikes = new List<ObjectId>(),
                Likes = new List<ObjectId>(),
                Section_id = newSectId
            };

            var section = new SectionSE
            {
                id = newSectId,
                Type = type
            };

            var f1 = DB.F<T>().Eq(f => f.id, id);
            var u1 = DB.U<T>().Push(u => u.Sections, section);
            await DB.UpdateAsync(f1, u1);

            //WARNING: works just for one language
            var f2 = DB.F<WikiTextsEntity>().Eq(f => f.Article_id, id);
            var u2 = DB.U<WikiTextsEntity>().Push(u => u.Texts, sectionText);
            await DB.UpdateAsync(f2, u2);            
        }

        public string CreateCity(CityDO city, string lang)
        {
            var cityLink = LinkBuilder.BuildLinkCity(city.AsciiName, city.CountryCode, city.GID);

            var builder = new ArticleBuilder();
            builder.InitCity(city.CountryCode);
            builder.InitTexts(lang, city.AsciiName, cityLink);
            var article = (WikiCityEntity)builder.Article;

            var sections = CitySecions();
            foreach (string section in sections)
            {
                builder.AddSection(section, string.Empty);
            }

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

            CreateCityPrices(builder);
            
            builder.Save<WikiCityEntity>(DB);
            
            return article.id.ToString();
        }

        private void CreateCityPrices(ArticleBuilder builder)
        {
            builder.AddPrice("TaxiInitial", "Transport");
            builder.AddPrice("TaxiKm", "Transport");
            builder.AddPrice("PublicTransport", "Transport");

            builder.AddPrice("Salad", "Restaurant");
            builder.AddPrice("Steak", "Restaurant");
            builder.AddPrice("Local", "Restaurant");
            builder.AddPrice("Pizza", "Restaurant");

            builder.AddPrice("Hostel", "Accommodation");
            builder.AddPrice("Star3", "Accommodation");
            builder.AddPrice("Star4", "Accommodation");

            builder.AddPrice("Cigarettes", "Other");

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

        public string CreateCountry(Continent continent, string countryCode, string name, string lang, int capitalGID, string capitalName)
        {
            var linkId = LinkBuilder.BuildBasicLink(name);

            var countryInfo = GNHelper.GetCountryInfo(countryCode);
            var countryData = countryInfo.geonames[0];

            var builder = new ArticleBuilder();
            builder.InitCountry(continent, countryCode);
            builder.InitTexts(lang, name, linkId);
            var article = (WikiCountryEntity)builder.Article;

            var sections = CountrySecions();
            foreach (string section in sections)
            {
                builder.AddSection(section, "No content");
            }
            
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
                //http://www.sitepoint.com/web-foundations/iso-2-letter-language-codes/
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
                //http://www.worldstandards.eu/cars/list-of-left-driving-countries/
                new ArticleDataSE
                {
                    id = ObjectId.GenerateNewId(),
                    Name = "DrivingRight",
                    Value = true.ToString(),
                    DataType = ArticleDataType.Bool,
                },
                //https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index
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
                //http://www.worldstandards.eu/electricity/plug-voltage-by-country/
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
        public string CountryCode;
        
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
            decimal price = DefaultPricer.GetDefaultPrice(CountryCode, type, subCategory);
            
            var item = new PriceItemSE
            {
                id = ObjectId.GenerateNewId(),
                Type = type,
                Category = category,
                SubCategory = subCategory,
                Price = new PriceSE
                {
                    CurrentPrice = price,
                    DefaultPrice = price,
                    Plus = new List<ObjectId>(),
                    Minus = new List<ObjectId>(),
                    Initialized = false
                }
            };

            ((WikiCityEntity)Article).Prices.Add(item);
        }

        

        public void InitCity(string countryCode)
        {
            CountryCode = countryCode;

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
            var sec = GetSectionAndTexts(type);

            Article.Sections.Add(sec.Section);
            Texts.Texts.Add(sec.Texts);
        }

        public SectionAndTexts GetSectionAndTexts(string type)
        {
            var id = ObjectId.GenerateNewId();

            var sectionText = new SectionTextsSE
            {
                Text = "",
                Dislikes = new List<ObjectId>(),
                Likes = new List<ObjectId>(),
                Section_id = id,
                Rating = 0,
            };

            var section = new SectionSE
            {
                id = id,
                Type = type
            };

            return new SectionAndTexts
            {
                Section = section,
                Texts = sectionText
            };
        }

        public void Save<T>(IDbOperations db) where T : WikiArticleBaseEntity
        {
            db.SaveAsync((T)Article);
            db.SaveAsync(Texts);
        }
    }

    public class SectionAndTexts
    {
        public SectionSE Section { get; set; }
        public SectionTextsSE Texts { get; set; }
    }
}