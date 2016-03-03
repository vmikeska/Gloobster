using System;
using System.Collections.Generic;
using System.Web.UI.WebControls;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{
    public class CountriesByContinent
    {
        public static string[] Europe =
        {
            "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO",
            "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "NL", "NO",
            "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "ME"
        };

        //public africa = ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GW", "GN", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TG", "TN", "UG", "ZM", "TZ", "ZW", "SS", "CD"];
        //public asia = ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TR", "TM", "AE", "UZ", "VN", "YE"];
        //public austraila = ["AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "SB", "TO", "TV", "VU", "WS", "TL"];
        //public northAmerica = ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"];
        //public southAmerica = ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"];
        //public eu = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "UK"];
        //private us = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];
    }

    public class InitialDataCreator
    {
        public IDbOperations DB { get; set; }
        public ICountryService CountryService { get; set; }


        public async void CreateInitialData()
        {
            var entitiesCount = await DB.GetCountAsync<WikiCountryEntity>();

            if (entitiesCount == 0)
            {
                CreateData();
            }
        }

        private void CreateData()
        {
            var sections = new List<SectionSE>();

            var europeEntity = CreateContinent(Continent.Europe, "Europe", "europe");
            foreach (var countryCode in CountriesByContinent.Europe)
            {
                var country = CountryService.GetCountryByCountryCode2(countryCode);
                var countryLink = BuildLink(country.CountryName);
                var countryEntity = CreateCountry(Continent.Europe, countryCode, country.CountryName, countryLink);
            }
        }

        private string BuildLink(string name)
        {
            var name1 = name.Replace(" ", "-");
            var name2 = name1.Replace(".", string.Empty);
            var name3 = name2.Replace("'", string.Empty);

            return name3;
        }


        private WikiCountryEntity CreateCountry(Continent continent, string countryCode, string title, string linkName)
        {
            var baseSectionId = ObjectId.GenerateNewId();
            var articleId = ObjectId.GenerateNewId();

            var entity = new WikiCountryEntity
            {
                id = articleId,
                //Type = WikiArticleType.Country,
                
                Continent = continent,                
                Sections = new List<SectionSE>
                {
                    new SectionSE {id = baseSectionId}
                },
                Links = new List<LinkSE>(),
                Data = new CountryDataSE
                {
                    CountryCode = countryCode,
                }
                //Photos = new List<PhotoSE>()
            };
            DB.SaveAsync(entity);

            var baseSectText = new SectionTextsCommonSE
            {
                Section_id = baseSectionId,
                BaseText = "Country",
                Title = title,
                Dislikes = new List<ObjectId>(),
                Likes = new List<ObjectId>()
            };

            var textsEntity = new WikiTextsEntity
            {
                id = ObjectId.GenerateNewId(),
                Language = "EN",
                Texts = new List<SectionTextsSE> {baseSectText},
                LinkName = linkName,
                Article_id = articleId
            };
            DB.SaveAsync(textsEntity);

            return entity;
        }

        private WikiCountryEntity CreateContinent(Continent continent, string title, string linkName)
        {
            var baseSectionId = ObjectId.GenerateNewId();
            var articleId = ObjectId.GenerateNewId();

            var entity = new WikiCountryEntity
            {
                id = articleId,
                //Type = WikiArticleType.Continent,
                
                Continent = continent,
                
                Sections = new List<SectionSE>
                {
                    new SectionSE {id = baseSectionId}
                },

                Links = new List<LinkSE>(),
                //Photos = new List<PhotoSE>()
            };
            DB.SaveAsync(entity);


            var baseSectTextEntity = new SectionTextsCommonSE
            {
                Section_id = baseSectionId,
                BaseText = "Continent",
                Title = title,
                Dislikes = new List<ObjectId>(),
                Likes = new List<ObjectId>()
            };

            var textsEntity = new WikiTextsEntity
            {
                id = ObjectId.GenerateNewId(),
                Language = "EN",
                Texts = new List<SectionTextsSE> {baseSectTextEntity},
                LinkName = linkName,
                Article_id = articleId
            };
            DB.SaveAsync(textsEntity);

            return entity;
        }        
    }

    public class ArticleCreator
    {
        public void CreateCityArticle()
        {
            var articleEntity = new WikiCountryEntity
            {
                id = ObjectId.GenerateNewId(),
                //Type = WikiArticleType.Country
                //Parent_id = 
            };
        }
    }
}


