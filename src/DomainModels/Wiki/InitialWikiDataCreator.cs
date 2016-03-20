using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Text;
using System.Web.UI.WebControls;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;
using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainModels.Wiki
{
    public class InitialWikiDataCreator : IInitialWikiDataCreator
    {
        public IDbOperations DB { get; set; }
        public ICountryService CountryService { get; set; }
        public IGeoNamesService GNService { get; set; }
        public IWikiArticleDomain ArticleDomain { get; set; }

        public const string Lang = "en";


        public async void CreateInitialData()
        {
            var entitiesCount = await DB.GetCountAsync<WikiContinentEntity>();
            if (entitiesCount == 0)
            {
                CreateData();
                CreateValueLists();
            }
        }

        public void CreateValueLists()
        {
            var hdi = new WikiListValuesEntity
            {
                id = ObjectId.GenerateNewId(),
                ListCategory = "HDI",
                Items = new List<WikiListValueSE>
                {
                    new WikiListValueSE
                    {
                        Id = 1,
                        Name = "Low",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 2,
                        Name = "Medium",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 3,
                        Name = "High",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 4,
                        Name = "VeryHigh",
                        Translate = true
                    }
                }
            };
            DB.SaveAsync(hdi);

            //todo: add more organizations
            var organizations = new WikiListValuesEntity
            {
                id = ObjectId.GenerateNewId(),
                ListCategory = "Organizations",
                Items = new List<WikiListValueSE>
                {
                    new WikiListValueSE
                    {
                        Id = 1,
                        Name = "UN",
                        Translate = false
                    },
                    new WikiListValueSE
                    {
                        Id = 2,
                        Name = "WHO",
                        Translate = false
                    },
                }
            };
            DB.SaveAsync(organizations);

            var religions = new WikiListValuesEntity
            {
                id = ObjectId.GenerateNewId(),
                ListCategory = "Religions",
                Items = new List<WikiListValueSE>
                {
                    new WikiListValueSE
                    {
                        Id = 1,
                        Name = "Christianity",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 2,
                        Name = "Islam",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 3,
                        Name = "Hinduism",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 4,
                        Name = "ChineseFolkReligion",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 5,
                        Name = "Buddhism",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 6,
                        Name = "Taoism",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 7,
                        Name = "Shinto",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 8,
                        Name = "Sikhism",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 9,
                        Name = "Judaism",
                        Translate = true
                    },
                    new WikiListValueSE
                    {
                        Id = 10,
                        Name = "Other",
                        Translate = true
                    },
                }
            };
            DB.SaveAsync(religions);
        }

        private async void CreateData()
        {
            await CreateEntireContinent(Continent.Europe, CountriesByContinent.Europe, "Europe", "europe");
            await CreateEntireContinent(Continent.Africa, CountriesByContinent.Africa, "Africa", "africa");
            await CreateEntireContinent(Continent.Asia, CountriesByContinent.Asia, "Asia", "asia");
            await CreateEntireContinent(Continent.Australia, CountriesByContinent.Australia, "Australia", "australia");
            await CreateEntireContinent(Continent.NorthAmerica, CountriesByContinent.NorthAmerica, "North America", "north-america");
            await CreateEntireContinent(Continent.SouthAmerica, CountriesByContinent.SouthAmerica, "South America", "south-america");

            await CreateEntireContinent(Continent.Antarctica, new string [0], "Antarctica", "antarctica");
        }

        private async Task<bool> CreateEntireContinent(Continent cont, string[] cCodes, string title, string link)
        {
            var continentEntity = CreateContinent(cont, title, link);
            foreach (var countryCode in cCodes)
            {
                //todo: production remove
                if (countryCode == "CZ")
                {
                    var dc = new DemoCountry();
                    await DB.SaveAsync(dc.Country);
                    await DB.SaveAsync(dc.Texts);

                    var dci = new DemoCity(dc.Country.id);
                    await DB.SaveAsync(dci.City);
                    await DB.SaveAsync(dci.Texts);
                    
                    continue;                    
                }

                var country = CountryService.GetCountryByCountryCode2(countryCode);
                
                string capitalName = GetCapitalName(countryCode);

                var capital = (await GNService.GetCityAsync(capitalName, country.CountryCode, 1)).FirstOrDefault();
                
                ArticleDomain.CreateCountry(cont, countryCode, country.CountryName, Lang, capital.GID, capitalName);
                if (capital != null)
                {
                    ArticleDomain.CreateCity(capital, Lang);
                }                
            }

            return true;
        }

        private string GetCapitalName(string countryCode)
        {
            if (countryCode == "IL")
            {
                return "Jerusalem";
            }
            else
            {
                var countryInfo = GNHelper.GetCountryInfo(countryCode);
                var countryData = countryInfo.geonames[0];

                return countryData.capital.ToString();
            }            
        }
        
        
        private async Task<WikiContinentEntity> CreateContinent(Continent continent, string title, string linkName)
        {
            var baseSectionId = ObjectId.GenerateNewId();
            var articleId = ObjectId.GenerateNewId();

            var entity = new WikiContinentEntity
            {
                id = articleId,                
                Continent = continent                
            };
            await DB.SaveAsync(entity);

            var baseSectTextEntity = new SectionTextsSE
            {
                Section_id = baseSectionId,
                Text = "Continent",                
                Dislikes = new List<ObjectId>(),
                Likes = new List<ObjectId>()
            };

            var textsEntity = new WikiTextsEntity
            {
                id = ObjectId.GenerateNewId(),
                Type = ArticleType.Continent,
                Title = title,
                Language = Lang,
                Texts = new List<SectionTextsSE> { baseSectTextEntity },
                LinkName = linkName,
                Article_id = articleId
            };
            await DB.SaveAsync(textsEntity);

            return entity;
        }        


    }

    public class CountriesByContinent
    {
        public static string[] Europe = { "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "NL", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "ME" };
        public static string[] Africa = { "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GW", "GN", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TG", "TN", "UG", "ZM", "TZ", "ZW", "SS", "CD" };
        public static string[] Asia = { "AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TR", "TM", "AE", "UZ", "VN", "YE" };
        public static string[] Australia = { "AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "SB", "TO", "TV", "VU", "WS", "TL" };
        public static string[] NorthAmerica = { "AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US" };
        public static string[] SouthAmerica = { "AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE" };

        public static int Count
        {
            get
            {
                return Europe.Count() + Africa.Count() + Asia.Count() + Australia.Count() + NorthAmerica.Count() + SouthAmerica.Count();
            }
        }

        //public eu = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "UK"];
        //private us = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];
    }

    public class PH
    {
        public static string GID(dynamic input)
        {
            string str = input.geonameId.ToString();
            return str;
        }

        public static int Population(dynamic input)
        {
            string str = input.population.ToString();
            return int.Parse(str);
        }

        public static string Currency(dynamic input)
        {
            string str = input.currencyCode.ToString();
            return str;
        }

        public static List<string> Languages(dynamic input)
        {
            string langsStr = input.languages.ToString();
            var output = langsStr.Split(',').ToList();
            return output;
        }

        public static double Area(dynamic input)
        {
            string str = input.areaInSqKm.ToString();
            var dec = double.Parse(str, CultureInfo.InvariantCulture);
            return dec;
        }
    }
    
    public class GNHelper
    {
        public static dynamic GetCountryInfo(string countryCode)
        {
            var qb = new QueryBuilder();
            qb.BaseUrl("http://api.geonames.org/")
                .Endpoint("countryInfoJSON")
                .Param("username", "gloobster")
                .Param("style", "full")
                .Param("country", countryCode);

            var url = qb.Build();

            WebRequest request = WebRequest.Create(url);
            // If required by the server, set the credentials.
            request.Credentials = CredentialCache.DefaultCredentials;

            WebResponse response = request.GetResponse();

            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);

            Stream dataStream = response.GetResponseStream();

            StreamReader reader = new StreamReader(dataStream);

            string responseFromServer = reader.ReadToEnd();
            dynamic objResponse = JsonConvert.DeserializeObject(responseFromServer);

            reader.Close();
            response.Close();

            return objResponse;
        }

        public static dynamic GetById(int gid)
        {
            var qb = new QueryBuilder();
            qb.BaseUrl("http://api.geonames.org/")
                .Endpoint("getJSON")
                .Param("username", "gloobster")
                .Param("geonameId", gid.ToString());

            var url = qb.Build();

            WebRequest request = WebRequest.Create(url);
            // If required by the server, set the credentials.
            request.Credentials = CredentialCache.DefaultCredentials;

            WebResponse response = request.GetResponse();

            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);

            Stream dataStream = response.GetResponseStream();

            StreamReader reader = new StreamReader(dataStream);

            string responseFromServer = reader.ReadToEnd();
            dynamic objResponse = JsonConvert.DeserializeObject(responseFromServer);

            reader.Close();
            response.Close();

            return objResponse;
        }
    }
    
    public class NiceLinkBuilder
    {
        //todo: query db, if link exists (e.g. singapore, singapore)
        public static string BuildLink(string name)
        {
            var name1 = name.Replace(" ", "-");
            var name2 = name1.Replace(".", string.Empty);
            var name3 = name2.Replace("'", string.Empty);
            var name4 = RemoveDiacritics(name3);
            var name5 = name4.ToLower();

            return name5;
        }

        public static string RemoveDiacritics(string s)
        {
            string normalizedString = s.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            for (int i = 0; i < normalizedString.Length; i++)
            {
                char c = normalizedString[i];
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    stringBuilder.Append(c);
            }

            return stringBuilder.ToString();
        }
    }
    
}


