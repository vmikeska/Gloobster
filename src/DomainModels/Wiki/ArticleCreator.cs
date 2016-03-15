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
    public class CountriesByContinent
    {
        public static string[] Europe = { "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO","FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "NL", "NO","PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "ME"};        
        public static string[] Africa = { "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GW", "GN", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TG", "TN", "UG", "ZM", "TZ", "ZW", "SS", "CD"};        
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

    public class DemoCity
    {
        public WikiCityEntity City;
        public WikiTextsEntity Texts;

        public DemoCity(ObjectId countryId)
        {
            Create("en", countryId);
        }

        private List<PriceItemSE> GetPrices(ObjectId votingUserOne)
        {
            var prices = new List<PriceItemSE>();

            prices.AddRange(new List<PriceItemSE>
            {
                new PriceItemSE
                {            
                    id = ObjectId.GenerateNewId(),
                    Type = "Taxi",
                    Category = "Transport",
                    Price = new PriceSE
                    {
                        CurrentPrice = 6.1m,
                        DefaultPrice = 6m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = "PublicTransport",
                    Category = "Transport",
                    Price = new PriceSE
                    {
                        CurrentPrice = 6.1m,
                        DefaultPrice = 6m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },
            });

            prices.AddRange(new List<PriceItemSE>
            {
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = "Salad",
                    Category = "Restaurant",
                    Price = new PriceSE
                    {
                        CurrentPrice = 6.1m,
                        DefaultPrice = 6m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = "Steak",
                    Category = "Restaurant",
                    Price = new PriceSE
                    {
                        CurrentPrice = 8.1m,
                        DefaultPrice = 8m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = "Local",
                    Category = "Restaurant",
                    Price = new PriceSE
                    {
                        CurrentPrice = 4.1m,
                        DefaultPrice = 4m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = "Pizza",
                    Category = "Restaurant",
                    Price = new PriceSE
                    {
                        CurrentPrice = 5.1m,
                        DefaultPrice = 5m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },

            });

            prices.AddRange(new List<PriceItemSE>
            {
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = "Hostel",
                    Category = "Accommodation",
                    Price = new PriceSE
                    {
                        CurrentPrice = 15.1m,
                        DefaultPrice = 15m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = "Star3",
                    Category = "Accommodation",
                    Price = new PriceSE
                    {
                        CurrentPrice = 40.1m,
                        DefaultPrice = 40m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = "Star4",
                    Category = "Accommodation",
                    Price = new PriceSE
                    {
                        CurrentPrice = 60.1m,
                        DefaultPrice = 60m,
                        Plus = new List<ObjectId> {votingUserOne},
                        Minus = new List<ObjectId>()
                    }
                },
            });

            prices.AddRange(GetPubItems(votingUserOne));

            return prices;
        }

        private List<PriceItemSE> CreateNightlifeItem(ObjectId votingUserOne, string type, string category)
        {
            return new List<PriceItemSE>
            {
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = type,
                    Category = category,
                    SubCategory = "Pub",
                    Price = new PriceSE
                    {
                        DefaultPrice = 2.0m,
                        CurrentPrice = 2.2m,
                        Minus = new List<ObjectId> {votingUserOne},
                        Plus = new List<ObjectId>()
                    }
                },
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = type,
                    Category = category,
                    SubCategory = "Bar",
                    Price = new PriceSE
                    {
                        DefaultPrice = 2.0m,
                        CurrentPrice = 2.1m,
                        Minus = new List<ObjectId> {votingUserOne},
                        Plus = new List<ObjectId>()
                    }
                },
                new PriceItemSE
                {
                    id = ObjectId.GenerateNewId(),
                    Type = type,
                    Category = category,
                    SubCategory = "Club",
                    Price = new PriceSE
                    {
                        DefaultPrice = 2.0m,
                        CurrentPrice = 2.1m,
                        Minus = new List<ObjectId> {votingUserOne},
                        Plus = new List<ObjectId>()
                    }
                },
            };
        }

        private List<PriceItemSE> GetPubItems(ObjectId votingUserOne)
        {
            var items = new List<PriceItemSE>();
            items.AddRange(CreateNightlifeItem(votingUserOne, "Beer", "Nightlife"));
            items.AddRange(CreateNightlifeItem(votingUserOne, "Wine", "Nightlife"));
            items.AddRange(CreateNightlifeItem(votingUserOne, "Whiskey", "Nightlife"));
            items.AddRange(CreateNightlifeItem(votingUserOne, "Vodka", "Nightlife"));
            items.AddRange(CreateNightlifeItem(votingUserOne, "Cigarettes", "Nightlife"));

            return items;
        }

        public void Create(string lang, ObjectId countryId)
        {
            var do1Id = ObjectId.GenerateNewId();
            var do2Id = ObjectId.GenerateNewId();
            var dont1Id = ObjectId.GenerateNewId();
            var dont2Id = ObjectId.GenerateNewId();

            var baseId = ObjectId.GenerateNewId();
            var aboutPoeopleId = ObjectId.GenerateNewId();
            var nightlifeId = ObjectId.GenerateNewId();
            var restaurantId = ObjectId.GenerateNewId();
            var transportId = ObjectId.GenerateNewId();
            var accommodationId = ObjectId.GenerateNewId();
            var tippingId = ObjectId.GenerateNewId();
            var sightsId = ObjectId.GenerateNewId();
            var nightlifePricesId = ObjectId.GenerateNewId();
            var barDistrictsId = ObjectId.GenerateNewId();

            var votingUserOne = ObjectId.GenerateNewId();
            
            City = new WikiCityEntity
            {
                id = ObjectId.GenerateNewId(),
                Dos = new List<ObjectId> { do1Id, do2Id },
                Donts = new List<ObjectId> { dont1Id, dont2Id },
                Prices = GetPrices(votingUserOne),
                Sections = new List<SectionSE>
                {                    
                    new SectionSE
                    {
                        Type = "Base",
                        id = baseId
                    },
                    new SectionSE
                    {
                        Type = "BarDistricts",
                        id = barDistrictsId
                    },
                    
                    new SectionSE
                    {
                        Type = "FavoriteSites",
                        id = sightsId
                    },                    
                    new SectionSE
                    {
                        Type = "AboutPeople",
                        id = aboutPoeopleId
                    },
                    new SectionSE
                    {
                        Type = "NightLife",
                        id = nightlifeId
                    },
                    new SectionSE
                    {
                        Type = "NightLife",
                        id = nightlifeId
                    },
                    new SectionSE
                    {
                        Type = "NightlifePrices",
                        id = nightlifePricesId
                    },                    
                    new SectionSE
                    {
                        Type = "Restaurant",
                        id = restaurantId
                    },
                    new SectionSE
                    {
                        Type = "Transport",
                        id = transportId
                    },
                    new SectionSE
                    {
                        Type = "Accommodation",
                        id = accommodationId
                    },
                    new SectionSE
                    {
                        Type = "Tipping",
                        id = tippingId
                    },

                },

                Data = new CityDataSE
                {
                    PopulationCity = 1244858,
                    PopulationMetro = 2484897,
                },

                PlacesLinks = new List<LinkObjectSE>
                {
                    new LinkObjectSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Category = "BarDistricts",
                        Name = "Žižkov",
                        Links = new List<LinkItemSE>
                        {
                            new LinkItemSE
                            {
                                id = ObjectId.GenerateNewId(),
                                SourceId = "4e57b97645dd1de4d98a9a3d",
                                Type = SourceType.S4,
                            }
                        }
                    },
                    new LinkObjectSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Category = "BarDistricts",
                        Name = "Náplavka",
                        Links = new List<LinkItemSE>()
                    },
                    new LinkObjectSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Category = "BarDistricts",
                        Name = "Nové město",
                        Links = new List<LinkItemSE>()
                    },

                    new LinkObjectSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Category = "Sights",
                        Name = "Colosseum",
                        Links = new List<LinkItemSE>
                        {
                            new LinkItemSE
                            {
                                id = ObjectId.GenerateNewId(),
                                SourceId = "4adcdac6f964a520355321e3",
                                Type = SourceType.S4
                            },
                            new LinkItemSE
                            {
                                id = ObjectId.GenerateNewId(),
                                SourceId = "colosseo-roma",
                                Type = SourceType.Yelp
                            },
                            new LinkItemSE
                            {
                                id = ObjectId.GenerateNewId(),
                                SourceId = "106151256083561",
                                Type = SourceType.FB
                            },
                        }
                    },
                    new LinkObjectSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Category = "Sights",
                        Name = "Fori Imperiali"
                    },
                },
                
                GID = 5464563,
                Country_id = countryId,
                Links = new List<LinkSE>(),
                Photos = new List<WikiPhotoSE>()
            };
            
            var texts = new List<SectionTextsSE>
            {
                new SectionTextsSE
                {
                    Section_id = sightsId,
                    Text = "",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Section_id = nightlifePricesId,
                    Text = "",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Section_id = barDistrictsId,
                    Text = "",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },

                new SectionTextsSE
                {
                    Section_id = baseId,
                    Text = "People of Prague are mostly nice, sometimes too much proud of this incredible city being built carefully for over 1000 years. If they share any language in common with you, they will gladly fall in chat with you. People of Prague are mostly nice, sometimes too much proud of this incredible city being built carefully for over 1000 years. If they share any language in common with you, they will gladly fall in chat with you.",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Section_id = aboutPoeopleId,
                    Text = "People of Prague are mostly nice, sometimes too much proud of this incredible city being built carefully for over 1000 years. If they share any language in common with you, they will gladly fall in chat with you.",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Section_id = nightlifeId,
                    Text = "Thousands of bars, pubs and clubs ready to serve you day and night, 365. Thousands of bars, pubs and clubs ready to serve you day and night, 365. Thousands of bars, pubs and clubs ready to serve you day and night, 365.",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Section_id = restaurantId,
                    Text = "Prague restaurants consist mostly of Local (middle European style), Italian and Asian. The quality of food overall is not bad and rising every year.",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Section_id = transportId,
                    Text = "Transport in Prague is not expensive. You can use wide network of public transportation system. Prague Metro lines are one of the cleanest in the world. TAXIs are also relatively cheap, but rather take just these from official stands and or ask somebody local to recommend you a taxi to call. In bus/tram do not keep your backpack on and always leave your seat and offer it when an elderly person gets in.",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Section_id = accommodationId,
                    Text = "Accommodation capacity in Prague is rising every year. There is definitely more capacity then tourists and therefore hotels in center of Prague are usually cheaper than hotels around the city. Hotels in Prague are in top condition.",
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },

                //dd items                
                new SectionTextsSE
                {
                    Text = "Acknowledge the meaning of 'S.P.Q.R' old motto of the Roman Republic: Senatus Populusque Romanus ('The Senate and People of Rome'); a humorous variation is 'Sono pazzi questi romani' (these Romans are crazy).",
                    Section_id = do1Id,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Take in a game of football at the Olympic Stadium. Rome has two teams, A.S. Roma and S.S. Lazio and they both play there",
                    Section_id = do2Id,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Try pizza at restaurant in Rome. It is very thin and crusted, very different from the classical pizza made in Naples",
                    Section_id = dont1Id,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Drive in Rome! The traffic in the city centre can be very chaotic",
                    Section_id = dont2Id,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                }
            };

            Texts = new WikiTextsEntity
            {
                id = ObjectId.GenerateNewId(),
                Type = ArticleType.City,
                Language = lang,
                Title = "Prague",
                LinkName = "prague",
                Article_id = City.id,
                Texts = texts
            };
        }
    }

    public class DemoCountry
    {
        public WikiCountryEntity Country;
        public WikiTextsEntity Texts;

        public DemoCountry()
        {
            Create("en");
        }

        public void Create(string lang)
        {
            var do1Id = ObjectId.GenerateNewId();
            var do2Id = ObjectId.GenerateNewId();
            var dont1Id = ObjectId.GenerateNewId();
            var dont2Id = ObjectId.GenerateNewId();

            var aboutPeopleId = ObjectId.GenerateNewId();
            var languagesId = ObjectId.GenerateNewId();
            var safetyId = ObjectId.GenerateNewId();
            var marihuanaId = ObjectId.GenerateNewId();
            var gayId = ObjectId.GenerateNewId();
            var transportId = ObjectId.GenerateNewId();
            var restaurantId = ObjectId.GenerateNewId();
            var tippingId = ObjectId.GenerateNewId();
            var accommodationId = ObjectId.GenerateNewId();
            
            Country = new WikiCountryEntity
            {
                id = ObjectId.GenerateNewId(),                
                Dos = new List<ObjectId> { do1Id, do2Id },
                Donts = new List<ObjectId> { dont1Id, dont2Id },
                Data = new CountryDataSE
                {
                    CountryCode = "CZ",
                    Languages = new List<string> { "Czech" },
                    Population = 10004000,
                    CallingCode = "+420",
                    CapitalName = "Prague",
                    CapitalId = 465456465,
                    CurrencyCode = "CZK",
                    CurrencyName = "Ceska koruna",
                    DrivingRight = true,
                    HDI = HDI.VeryHigh,
                    MemberOf = new List<string> { "EU", "UNESCO" },
                    Religion = ReligionType.RomanCatolic,
                    SocketType = SocketType.V220HZ50
                },
                Links = new List<LinkSE>
                {
                    new LinkSE {Type = LinkType.WIKI, Link = "https://en.wikipedia.org/wiki/Czech_Republic"}
                },
                Continent = Continent.Europe,
                Sections = new List<SectionSE>
                {
                    new SectionSE {id = aboutPeopleId, Type = "AboutPeople"},
                    new SectionSE {id = languagesId, Type = "Languages"},
                    new SectionSE {id = safetyId, Type = "Safety"},
                    new SectionSE {id = marihuanaId, Type = "Marihuana"},
                    new SectionSE {id = gayId, Type = "Gay"},
                    new SectionSE {id = transportId, Type = "Transport"},
                    new SectionSE {id = restaurantId, Type = "Restaurants"},
                    new SectionSE {id = tippingId, Type = "Tipping"},
                    new SectionSE {id = accommodationId, Type = "Accommodation"},
                },
                GID = 546645
            };
            
            var texts = new List<SectionTextsSE>
            {
                new SectionTextsSE
                {
                    Text = "Generally italians are friendly and courteous. The differences between North and South apply also for habbits, tradition, behaviour. Italians from South are more outgoing, talkative, warm, while Northerners are more reliable and discrete. All Italians like football, good wine and food, fancy clothes and sport cars.",
                    Section_id = aboutPeopleId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Native language is italian. Every region in Italy has a distinct native Romance dialect (which is, sometimes, a language). English has been introduced atschool, inthe1970s, replacing French. Therefore most younger Italians have studied English, however exposure proficiency tends to be poor. Senior citizens rarely know English, but they'll try to help you anyway with gestures or similar words. If you are going to speak in English, it is polite begin the conversation in Italian and ask if the person understands English before proceeding.",
                    Section_id = languagesId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                   Text = "Petty crime can be a problem, pickpockets concentrate in touristic area, there are gangs known for tampering with ATMs by placing 'skimmers' in front of the card slot and get a clone of your card. When using a taxi, be careful with the change (intentionally given wrong) and the fare(over charge). Italian hospitals are public and offer completely free high-standard treatments for EU travellers, although, as anywhere else, you may have a long wait to be served.Emergency assistance is granted even to non-EU travelers. Unfortunately racism is still present in Italy.",
                   Section_id = safetyId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Possession of drugs is always illegal, but it is a criminal offence only above a certain amount. A particular scam is when some fake police will approach you, asking to look for 'drug money', or ask to see your document. This is a scam to take your money.",
                    Section_id = marihuanaId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Italy is NOT a gay-friendly country, however, slowly, the common opinions have been changed and gay are more tollerated, while most Italians are still disturbed by public displays of affection from same-sex couples; female solo travellers will feel safe, despite the constant attention of local male, it is a common understanding that if a girl will accept a conversation with a boy she meant to be interested in him. ",
                    Section_id = gayId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Trains in Italy are generally good value, there are different train types: high-speed trains (Frecciarossa, Frecciargento, Frecciabianca, Eurostar Italia), Intercity, regional trains (Regionali, Regionali Veloci).  Prices for fast trains are much higher than regional ones. There is a good number of bus providers going between bigger cities, too. A well-developed system of motorways allows to travel by car, everywhere, however both petrol and speedway high costs have to be taken in consideration. ",
                    Section_id = transportId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Tipping is not very common (as good manner you can add 5% when you pay the bill, if you liked the service). Majority of restaurants will already include a fee for service (called 'coperto'), it is around 1.5€ per person.",
                    Section_id = tippingId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "A visit to Italy it goes together with a restaurant experience. As an easy rule of thumb it is better to avoid premises in touristic areas, as the quality of food will be low while prices will be higher than avarage. Every italian regions has its own specialties that vary from region to region, if not even from city to city. For instance risotto is from northern regions while spaghetti and pasta are mostly from South Italy. Pizza is originally from Napoli, the Neapolitan one is the only traditional pizza. In Italy you can find nearly 800 kinds of cheese, including the famous Parmigiano Reggiano, and over 400 types of sausages. Gelato (ice cream) is avalable in any bar, however at the gelateria is where to taste a better one.",
                    Section_id = restaurantId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Due to the big number of tourists, the hospitality industry offers opportunities for every budget, from camping to high class hotels, however, sleeping in Italy it is slightly expensive.  Hostels are not widely present, instead, farmstays are an increasingly popular way to experience Italy, particularly in rural areas. Prices and availability might be a concern, in peak seasons (summer along the coast and winter in the Alpine regions).",
                    Section_id = accommodationId,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },

                //do dont
                new SectionTextsSE
                {
                    Text = "Acknowledge the meaning of 'S.P.Q.R' old motto of the Roman Republic: Senatus Populusque Romanus ('The Senate and People of Rome'); a humorous variation is 'Sono pazzi questi romani' (these Romans are crazy).",
                    Section_id = do1Id,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Take in a game of football at the Olympic Stadium. Rome has two teams, A.S. Roma and S.S. Lazio and they both play there",
                    Section_id = do2Id,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Try pizza at restaurant in Rome. It is very thin and crusted, very different from the classical pizza made in Naples",
                    Section_id = dont1Id,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
                new SectionTextsSE
                {
                    Text = "Drive in Rome! The traffic in the city centre can be very chaotic",
                    Section_id = dont2Id,
                    Dislikes = new List<ObjectId>(),
                    Likes = new List<ObjectId>()
                },
            };

            Texts = new WikiTextsEntity
            {
                id = ObjectId.GenerateNewId(),
                Type = ArticleType.Country,
                Texts = texts,
                Language = lang,
                Title = "Czech republic",
                LinkName = "czech-republic",
                Article_id = Country.id
            };
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

    public interface IInitialDataCreator
    {
        void CreateInitialData();
    }

    public class PH
    {
        public static int GID(dynamic input)
        {
            string str = input.geonameId.ToString();
            return int.Parse(str);
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

    public class InitialDataCreator : IInitialDataCreator
    {
        public IDbOperations DB { get; set; }
        public ICountryService CountryService { get; set; }
        public IGeoNamesService GNService { get; set; }

        public const string Lang = "en";


        public async void CreateInitialData()
        {
            var entitiesCount = await DB.GetCountAsync<WikiContinentEntity>();
            if (entitiesCount == 0)
            {
                CreateData();
            }
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
                var country = CountryService.GetCountryByCountryCode2(countryCode);
                var countryEntity = await CreateCountry(cont, country);                                
            }

            return true;
        }

        private string GetCapitalName(dynamic countryData, string countryCode)
        {
            if (countryCode == "IL")
            {
                return "Jerusalem";
            }
            else
            {
                return countryData.capital.ToString();
            }            
        }

        private async Task<WikiCityEntity> CreateCity(CityDO city, ObjectId countryId)
        {
            var baseSectionId = ObjectId.GenerateNewId();
            var articleId = ObjectId.GenerateNewId();

            var cityLink = NiceLinkBuilder.BuildLink(city.AsciiName);
            var title = city.AsciiName;
            
            var entity = new WikiCityEntity
            {
                id = articleId,
                Country_id = countryId,
                GID = city.GID,
                

                Sections = new List<SectionSE>
                {
                    new SectionSE {id = baseSectionId}
                },
                Links = new List<LinkSE>(),
                Data = new CityDataSE
                {
                  CountryCode = city.CountryCode,
                  PopulationCity = city.Population,
                  //todo:
                  PopulationMetro = city.Population                  
                }
            };
            await DB.SaveAsync(entity);

            var baseSectText = new SectionTextsSE
            {
                Section_id = baseSectionId,
                Text = "City",
                Dislikes = new List<ObjectId>(),
                Likes = new List<ObjectId>()
            };

            var textsEntity = new WikiTextsEntity
            {
                id = ObjectId.GenerateNewId(),
                Type = ArticleType.City,
                Title = title,
                Language = Lang,
                Texts = new List<SectionTextsSE> { baseSectText },
                LinkName = cityLink,
                Article_id = articleId
            };
            await DB.SaveAsync(textsEntity);

            return entity;
        }

        private async Task<WikiCountryEntity> CreateCountry(Continent continent, Country country)
        {
            if (country.CountryCode == "CZ")
            {
                var dc = new DemoCountry();
                await DB.SaveAsync(dc.Country);
                await DB.SaveAsync(dc.Texts);

                var dci = new DemoCity(dc.Country.id);
                await DB.SaveAsync(dci.City);
                await DB.SaveAsync(dci.Texts);

                return dc.Country;
            }

            var baseSectionId = ObjectId.GenerateNewId();
            var articleId = ObjectId.GenerateNewId();

            var countryLink = NiceLinkBuilder.BuildLink(country.CountryName);
            var title = country.CountryName;

            var countryInfo = GNHelper.GetCountryInfo(country.CountryCode);
            var countryData = countryInfo.geonames[0];
            
            string capitalName = GetCapitalName(countryData, country.CountryCode);

            var capital = (await GNService.GetCityAsync(capitalName, country.CountryCode, 1)).FirstOrDefault();
            if (capital == null)
            {
                throw new Exception("No capital found");
            }

            var entity = new WikiCountryEntity
            {
                id = articleId,

                GID = PH.GID(countryData),
                
                Continent = continent,                
                Sections = new List<SectionSE>
                {
                    new SectionSE {id = baseSectionId}
                },
                Links = new List<LinkSE>(),
                Data = new CountryDataSE
                {
                    CountryCode = country.CountryCode,
                    Languages = PH.Languages(countryData),
                    Population = PH.Population(countryData),
                    Area = PH.Area(countryData),
                    CallingCode = "---",
                    CapitalId = capital.GID,
                    CapitalName = capital.Name,
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
                    
                }
            };
            await DB.SaveAsync(entity);

            var baseSectText = new SectionTextsSE
            {
                Section_id = baseSectionId,
                Text = "Country",                
                Dislikes = new List<ObjectId>(),
                Likes = new List<ObjectId>()
            };

            var textsEntity = new WikiTextsEntity
            {
                id = ObjectId.GenerateNewId(),
                Type = ArticleType.Country,
                Title = title,
                Language = Lang,
                Texts = new List<SectionTextsSE> {baseSectText},
                LinkName = countryLink,
                Article_id = articleId
            };
            await DB.SaveAsync(textsEntity);

            var capitalEntity = await CreateCity(capital, articleId);

            return entity;
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

    public class NiceLinkBuilder
    {
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


