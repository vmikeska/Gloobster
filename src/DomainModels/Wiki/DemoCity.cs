using System.Collections.Generic;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{
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
                CountryCode = "CZ",
                Dos = new List<ObjectId> { do1Id, do2Id },
                Donts = new List<ObjectId> { dont1Id, dont2Id },
                Data = new CountryDataSE
                {                    
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
                    new LinkSE
                    {
                        Type = LinkType.Geonames,
                        id = ObjectId.GenerateNewId(),
                        Link = string.Empty,
                        SID = "546645"
                    },
                    new LinkSE
                    {
                        Type = LinkType.WIKI,
                        Link = "https://en.wikipedia.org/wiki/Czech_Republic",
                        id = ObjectId.GenerateNewId(),
                        SID = "Czech_Republic"
                    }
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
                }
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
                CountryCode = "CZ",
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
                Links = new List<LinkSE>
                {
                    new LinkSE
                    {
                        Type = LinkType.Geonames,
                        id = ObjectId.GenerateNewId(),
                        Link = string.Empty,
                        SID = "5464563"
                    }
                },
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
}