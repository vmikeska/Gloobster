using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using Serilog;
using System.Linq;
using FourSquare.SharpSquare.Entities;
using Gloobster.DomainModels.Wiki;
using Gloobster.Portal.Controllers.Api.Wiki;

namespace Gloobster.Portal.Controllers.Portal
{
    public class WikiController : PortalBaseController
    {
        public IFilesDomain FileDomain { get; set; }

        public WikiController(IFilesDomain filesDomain, ILogger log,  IDbOperations db) : base(log, db)
        {
            FileDomain = filesDomain;
        }

        public IActionResult PageRegular(string id, string lang)
        {
            WikiModelBase vm = null;
            string template = string.Empty;
            var text = DB.C<WikiTextsEntity>().FirstOrDefault(i => i.LinkName == id && i.Language == lang);
            
            if (text.Type == ArticleType.Country)
            {
                vm = GetCountryVM(text);
                template = "Country";
            }
            if (text.Type == ArticleType.City)
            {
                vm = GetCityVM(text);
                template = "City";
            }

            vm.IsAdmin = true;
            vm.ArticleId = text.Article_id.ToString();

            var langVers = DB.C<WikiTextsEntity>()
                .Where(i => i.Article_id == text.Article_id)
                .Select(a => new {a.Language, a.LinkName})
                .ToList();

            vm.LangVersions = 
                langVers.Select(i => new LangVersionVM {Language = i.Language, LinkName = i.LinkName}).ToList();
            
            return View(template, vm);
        }

        private WikiCityViewModel GetCityVM(WikiTextsEntity text)
        {
            var article = DB.C<WikiCityEntity>().FirstOrDefault(i => i.id == text.Article_id);

            var vm = CreateViewModelInstance<WikiCityViewModel>();
            vm.Texts = text;
            vm.Article = article;

            return vm;
        }

        private WikiCountryViewModel GetCountryVM(WikiTextsEntity text)
        {
            var article = DB.C<WikiCountryEntity>().FirstOrDefault(i => i.id == text.Article_id);

            var vm = CreateViewModelInstance<WikiCountryViewModel>();
            vm.Texts = text;
            vm.Article = article;

            return vm;
        }

        public IActionResult ArticleTitlePhoto(string id)
        {
            var stream = GetPicture(id, WikiFileConstants.TitlePhotoNameExt);
            return stream;
        }

        public IActionResult ArticlePhoto(string photoId, string articleId)
        {
            var name = $"{photoId}.jpg";
            var stream = GetPicture(articleId, name, WikiFileConstants.GalleryDir);
            return stream;
        }

        public IActionResult ArticlePhotoThumb(string photoId, string articleId)
        {
            var name = $"{photoId}_thumb.jpg";            
            var stream = GetPicture(articleId, name, WikiFileConstants.GalleryDir);
            return stream;
        }

        private FileStreamResult GetPicture(string articleId, string picName, string customDir = null)
        {
            var articleDir = FileDomain.Storage.Combine(WikiFileConstants.FileLocation, articleId);
            var finalDir = articleDir;
            
            if (!string.IsNullOrEmpty(customDir))
            {
                finalDir = FileDomain.Storage.Combine(articleDir, customDir);
            }
            
            var filePath = FileDomain.Storage.Combine(finalDir, picName);
            bool exists = FileDomain.Storage.FileExists(filePath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(finalDir, picName);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return null;
        }

        public IActionResult Page(string id)
        {
            var texts = DB.C<WikiTextsEntity>().Where(i => i.LinkName == id).ToList();

            if (texts.Count == 0)
            {
                return HttpNotFound();
            }

            WikiTextsEntity englishText = texts.FirstOrDefault(i => i.Language == "en");
            var selectedText = englishText ?? texts.First();

            var url = $"/wiki/{selectedText.Language}/{selectedText.LinkName}";
            return RedirectPermanent(url);
        }

        public IActionResult LinkMap()
        {
            var vm = CreateViewModelInstance<WikiLinkMapViewModel>();

            var continents = DB.C<WikiContinentEntity>().ToList();
            var countries = DB.C<WikiCountryEntity>().ToList();
            var cities = DB.C<WikiCityEntity>().ToList();

            vm.Languages = new List<WikiLanguageVM>
            {
                GetLanguageEntries("en", countries, cities, continents)                
            };

            return View(vm);
        }

        private WikiLanguageVM GetLanguageEntries(string language, List<WikiCountryEntity> countriesE, 
            List<WikiCityEntity> citiesE, List<WikiContinentEntity> continents)
        {
            var langs = DB.C<WikiTextsEntity>().Where(c => c.Language == language).ToList();
            var texts = langs.Select(i => new WikiLinkVM
            {
                Id = i.Article_id.ToString(),
                Title = i.Title,
                Link = i.LinkName
            }).ToList();

            var langItem = new WikiLanguageVM
            {
                Language = language,                
                Countries = new List<WikiCountryVM>(),
                Continents = texts.Where(i => continents.Select(c => c.id.ToString()).Contains(i.Id)).ToList()
            };

            foreach (var countryE in countriesE)
            {
                var countryCities = citiesE.Where(c => c.CountryCode == countryE.CountryCode).ToList();

                var countryLink = new WikiCountryVM
                {
                    Cities = new List<WikiLinkVM>(),
                    Country = texts.First(i => i.Id == countryE.id.ToString())
                };

                foreach (var countryCity in countryCities)
                {
                    var lng = texts.First(i => i.Id == countryCity.id.ToString());
                    countryLink.Cities.Add(lng);
                }

                langItem.Countries.Add(countryLink);
            }

            return langItem;
        }

        public IActionResult Home()
        {
            var vm = CreateViewModelInstance<WikiHomeViewModel>();

            return View(vm);
        }

  //      public IActionResult Continent()
  //      {
  //          var vm = CreateViewModelInstance<WikiContinentViewModel>();
            
  //          return View(vm);
  //      }

  //      public IActionResult Country(string id)
  //      {
  //          var link = id;

  //          //var texts = DB.C<WikiTextsEntity>()

  //          var vm = CreateViewModelInstance<WikiCountryViewModel>();
  //          //vm.Article = DB.C<WikiCountryEntity>().FirstOrDefault(i => i.id ==)
  //          //vm.Texts = dCountry.Texts;

  //          //var dCountry = new DemoCountry();
  //          //var vm = CreateViewModelInstance<WikiCountryViewModel>();
  //          //vm.Article = dCountry.Country;            
  //          //vm.Texts = dCountry.Texts;

  //          return View(vm);
  //      }
        
  //      public IActionResult City()
	 //   {
  //          var dCity = new DemoCity(ObjectId.GenerateNewId());

  //          var vm = CreateViewModelInstance<WikiCityViewModel>();
  //          vm.Article = dCity.City;
  //          vm.Texts = dCity.Texts;

  //          return View(vm);
		//}
        
    


	}
}


//   var do1Id = ObjectId.GenerateNewId();
//   var do2Id = ObjectId.GenerateNewId();
//   var dont1Id = ObjectId.GenerateNewId();
//   var dont2Id = ObjectId.GenerateNewId();

//   var aboutPoeopleId = ObjectId.GenerateNewId();
//   var nightlifeId = ObjectId.GenerateNewId();
//   var restaurantId = ObjectId.GenerateNewId();
//   var transportId = ObjectId.GenerateNewId();
//   var accommodationId = ObjectId.GenerateNewId();
//   var tippingId = ObjectId.GenerateNewId();

//   var vm = CreateViewModelInstance<WikiCityViewModel>();

//var votingUserOne = ObjectId.GenerateNewId();

//   vm.Article = new WikiCityEntity
//   {
//       Dos = new List<ObjectId> { do1Id, do2Id},
//       Donts = new List<ObjectId> { dont1Id, dont2Id},
//       Sections = new List<SectionSE>
//       {
//           new SectionSE
//           {
//               Type = "AboutPeople",
//               id = aboutPoeopleId
//           },
//           new SectionSE
//           {
//               Type = "NightLife",
//               id = nightlifeId
//           },
//           new SectionSE
//           {
//               Type = "Restaurant",
//               id = restaurantId
//           },
//           new SectionSE
//           {
//               Type = "Transport",
//               id = transportId
//           },
//           new SectionSE
//           {
//               Type = "Accommodation",
//               id = accommodationId
//           },
//           new SectionSE
//           {
//               Type = "Tipping",
//               id = tippingId
//           },

//       },

//       Data = new CityDataSE
//       {
//           PopulationCity = 1244858,
//           PopulationMetro = 2484897,
//       },

//       Sights = new List<SiteSE>
//       {
//           new SiteSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Colosseum",
//               Links = new List<LinkItemSE>
//               {
//                   new LinkItemSE
//                   {
//                       SourceId = "4adcdac6f964a520355321e3",
//                       Type = SourceType.S4
//                   },
//                   new LinkItemSE
//                   {
//                       SourceId = "colosseo-roma",
//                       Type = SourceType.Yelp
//                   },
//                   new LinkItemSE
//                   {
//                       SourceId = "106151256083561",
//                       Type = SourceType.FB
//                   },
//               }
//           },
//           new SiteSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Fori Imperiali"
//           },
//           new SiteSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Pantheon "
//           },
//           new SiteSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Fontana di Trevi"
//           },
//           new SiteSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Piazza di Spagna"
//           },
//           new SiteSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Vaticano and Piazza S. Pietro "
//           },
//           new SiteSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Piazza Navona"
//           },
//       },

//       PubItems = new List<PubItemSE>
//       {
//           new PubItemSE
//           {
//               Type = "Beer",
//               PriceBar = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.2m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PriceClub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PricePub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               }
//           },
//           new PubItemSE
//           {
//               Type = "Wine",
//               PriceBar = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PriceClub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PricePub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               }
//           },
//           new PubItemSE
//           {
//               Type = "Whiskey",
//               PriceBar = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PriceClub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PricePub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               }
//           },
//           new PubItemSE
//           {
//               Type = "Vodka",
//               PriceBar = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PriceClub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PricePub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               }
//           },
//           new PubItemSE
//           {
//               Type = "Cigarettes",
//               PriceBar = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PriceClub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               },
//               PricePub = new PriceSE
//               {
//                   DefaultPrice = 2.0m,
//                   CurrentPrice = 2.1m,
//                   Minus = new List<ObjectId> {votingUserOne},
//                   Plus = new List<ObjectId>()
//               }
//           },
//       },

//       BarDistricts = new List<BarDistrictSE>
//       {
//           new BarDistrictSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Žižkov",
//               Links = new List<LinkItemSE>
//               {
//                   new LinkItemSE
//                   {
//                       SourceId = "4e57b97645dd1de4d98a9a3d",
//                       Type = SourceType.S4                                
//                   }
//               }
//           },
//           new BarDistrictSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Náplavka",
//               Links = new List<LinkItemSE>()
//           },
//           new BarDistrictSE
//           {
//               id = ObjectId.GenerateNewId(),
//               Name = "Nové město",
//               Links = new List<LinkItemSE>()
//           }
//       },

//       TransportItems = new List<PriceItemSE>
//       {
//           new PriceItemSE
//           {
//               Type = "Taxi",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 6.1m,
//                   DefaultPrice = 6m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()
//               }
//           },
//           new PriceItemSE
//           {
//               Type = "PublicTransport",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 6.1m,
//                   DefaultPrice = 6m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()
//               }
//           },
//       },

//       RestaurantItems = new List<PriceItemSE>
//       {
//           new PriceItemSE
//           {
//               Type = "Salad",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 6.1m,
//                   DefaultPrice = 6m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()                            
//               }
//           },
//           new PriceItemSE
//           {
//               Type = "Steak",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 8.1m,
//                   DefaultPrice = 8m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()
//               }
//           },
//           new PriceItemSE
//           {
//               Type = "Local",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 4.1m,
//                   DefaultPrice = 4m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()
//               }
//           },
//           new PriceItemSE
//           {
//               Type = "Pizza",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 5.1m,
//                   DefaultPrice = 5m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()
//               }
//           },

//       },

//       AccommodationItems = new List<PriceItemSE>
//       {
//           new PriceItemSE
//           {
//               Type = "Hostel",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 15.1m,
//                   DefaultPrice = 15m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()
//               }
//           },
//           new PriceItemSE
//           {
//               Type = "Star3",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 40.1m,
//                   DefaultPrice = 40m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()
//               }
//           },
//           new PriceItemSE
//           {
//               Type = "Star4",
//               Price = new PriceSE
//               {
//                   CurrentPrice = 60.1m,
//                   DefaultPrice = 60m,
//                   Plus = new List<ObjectId> {votingUserOne },
//                   Minus = new List<ObjectId>()
//               }
//           },
//       }



//   };

//var ddTexts = new List<SectionTextsSE>
//{
//       new SectionTextsSE
//       {                    
//           Text = "Prague is one of the most beautiful historical cities in the world. Its large center, 866 hectares in size makes Prague unique history preservation. Prague is a popular night-life destination, with thousands of bars, pubs and clubs, happy to entertain any visitor, at any season, until early morning hours. Despite growing prices in last years, Prague is still considered as one of the cheapest metropoles in Europe with prices roughly one half of the West European standard."
//       },
//       new SectionTextsSE
//       {
//           Text = "Acknowledge the meaning of 'S.P.Q.R' old motto of the Roman Republic: Senatus Populusque Romanus ('The Senate and People of Rome'); a humorous variation is 'Sono pazzi questi romani' (these Romans are crazy).",
//           Section_id = do1Id                    
//       },
//       new SectionTextsSE
//       {
//           Text = "Take in a game of football at the Olympic Stadium. Rome has two teams, A.S. Roma and S.S. Lazio and they both play there",
//           Section_id = do2Id
//       },
//       new SectionTextsSE
//       {
//           Text = "Try pizza at restaurant in Rome. It is very thin and crusted, very different from the classical pizza made in Naples",
//           Section_id = dont1Id
//       },
//       new SectionTextsSE
//       {
//           Text = "Drive in Rome! The traffic in the city centre can be very chaotic",
//           Section_id = dont2Id
//       },
//   };

//   vm.Texts = new List<SectionTextsSE>
//   {
//       new SectionTextsSE
//       {
//           Section_id = aboutPoeopleId,
//           Text = "People of Prague are mostly nice, sometimes too much proud of this incredible city being built carefully for over 1000 years. If they share any language in common with you, they will gladly fall in chat with you."
//       },
//       new SectionTextsSE
//       {
//           Section_id = nightlifeId,
//           Text = "Thousands of bars, pubs and clubs ready to serve you day and night, 365. Thousands of bars, pubs and clubs ready to serve you day and night, 365. Thousands of bars, pubs and clubs ready to serve you day and night, 365."
//       },
//       new SectionTextsSE
//       {
//           Section_id = restaurantId,
//           Text = "Prague restaurants consist mostly of Local (middle European style), Italian and Asian. The quality of food overall is not bad and rising every year."
//       },
//       new SectionTextsSE
//       {
//           Section_id = transportId,
//           Text = "Transport in Prague is not expensive. You can use wide network of public transportation system. Prague Metro lines are one of the cleanest in the world. TAXIs are also relatively cheap, but rather take just these from official stands and or ask somebody local to recommend you a taxi to call. In bus/tram do not keep your backpack on and always leave your seat and offer it when an elderly person gets in."
//       },
//       new SectionTextsSE
//       {
//           Section_id = accommodationId,
//           Text = "Accommodation capacity in Prague is rising every year. There is definitely more capacity then tourists and therefore hotels in center of Prague are usually cheaper than hotels around the city. Hotels in Prague are in top condition."
//       }                
//   };
//   vm.Texts.AddRange(ddTexts);



//var do1Id = ObjectId.GenerateNewId();
//var do2Id = ObjectId.GenerateNewId();
//var dont1Id = ObjectId.GenerateNewId();
//var dont2Id = ObjectId.GenerateNewId();

//var aboutPeopleId = ObjectId.GenerateNewId();
//var languagesId = ObjectId.GenerateNewId();
//var safetyId = ObjectId.GenerateNewId();
//var marihuanaId = ObjectId.GenerateNewId();
//var gayId = ObjectId.GenerateNewId();
//var transportId = ObjectId.GenerateNewId();
//var restaurantId = ObjectId.GenerateNewId();
//var tippingId = ObjectId.GenerateNewId();
//var accommodationId = ObjectId.GenerateNewId();

//var vm = CreateViewModelInstance<WikiCountryViewModel>();

//vm.Article = new WikiCountryEntity
//{
//    id = ObjectId.GenerateNewId(),
//    Dos = new List<ObjectId> { do1Id, do2Id },
//    Donts = new List<ObjectId> { dont1Id, dont2Id },
//    Data = new CountryDataSE
//    {
//        CountryCode = "CZ",
//        Languages = new List<string> {"Czech"},
//        Population = 10004000,
//        CallingCode = "+420",
//        CapitalName = "Prague",
//        CapitalId = 465456465,
//        CurrencyCode = "CZK",
//        CurrencyName = "Ceska koruna",
//        DrivingRight = true,
//        HDI = HDI.VeryHigh,
//        MemberOf = new List<string> {"EU", "UNESCO"},
//        Religion = ReligionType.RomanCatolic,
//        SocketType = SocketType.V220HZ50
//    },
//    Links = new List<LinkSE>
//    {
//        new LinkSE {Type = LinkType.WIKI, Link = "https://en.wikipedia.org/wiki/Czech_Republic"}
//    },
//    Continent = Entities.Wiki.Continent.Europe,
//    Sections = new List<SectionSE>
//    {
//        new SectionSE {id = aboutPeopleId, Type = "AboutPeople"},
//        new SectionSE {id = languagesId, Type = "Languages"},
//        new SectionSE {id = safetyId, Type = "Safety"},
//        new SectionSE {id = marihuanaId, Type = "Marihuana"},
//        new SectionSE {id = gayId, Type = "Gay"},
//        new SectionSE {id = transportId, Type = "Transport"},
//        new SectionSE {id = restaurantId, Type = "Restaurants"},
//        new SectionSE {id = tippingId, Type = "Tipping"},
//        new SectionSE {id = accommodationId, Type = "Accommodation"},
//    },


//};

//var ddTexts = new List<SectionTextsSE>
//{
//    new SectionTextsSE
//    {
//        Text = "Acknowledge the meaning of 'S.P.Q.R' old motto of the Roman Republic: Senatus Populusque Romanus ('The Senate and People of Rome'); a humorous variation is 'Sono pazzi questi romani' (these Romans are crazy).",
//        Section_id = do1Id
//    },
//    new SectionTextsSE
//    {
//        Text = "Take in a game of football at the Olympic Stadium. Rome has two teams, A.S. Roma and S.S. Lazio and they both play there",
//        Section_id = do2Id
//    },
//    new SectionTextsSE
//    {
//        Text = "Try pizza at restaurant in Rome. It is very thin and crusted, very different from the classical pizza made in Naples",
//        Section_id = dont1Id
//    },
//    new SectionTextsSE
//    {
//        Text = "Drive in Rome! The traffic in the city centre can be very chaotic",
//        Section_id = dont2Id
//    },
//};

//vm.Title = "Czech Republic";

//vm.Texts = new List<SectionTextsSE>
//{
//    new SectionTextsSE
//    {
//        Text = "Generally italians are friendly and courteous. The differences between North and South apply also for habbits, tradition, behaviour. Italians from South are more outgoing, talkative, warm, while Northerners are more reliable and discrete. All Italians like football, good wine and food, fancy clothes and sport cars.",
//        Section_id = aboutPeopleId
//    },
//    new SectionTextsSE
//    {
//        Text = "Native language is italian. Every region in Italy has a distinct native Romance dialect (which is, sometimes, a language). English has been introduced atschool, inthe1970s, replacing French. Therefore most younger Italians have studied English, however exposure proficiency tends to be poor. Senior citizens rarely know English, but they'll try to help you anyway with gestures or similar words. If you are going to speak in English, it is polite begin the conversation in Italian and ask if the person understands English before proceeding.",
//        Section_id = languagesId
//    },
//    new SectionTextsSE
//    {
//       Text = "Petty crime can be a problem, pickpockets concentrate in touristic area, there are gangs known for tampering with ATMs by placing 'skimmers' in front of the card slot and get a clone of your card. When using a taxi, be careful with the change (intentionally given wrong) and the fare(over charge). Italian hospitals are public and offer completely free high-standard treatments for EU travellers, although, as anywhere else, you may have a long wait to be served.Emergency assistance is granted even to non-EU travelers. Unfortunately racism is still present in Italy.",
//       Section_id = safetyId
//    },
//    new SectionTextsSE
//    {
//        Text = "Possession of drugs is always illegal, but it is a criminal offence only above a certain amount. A particular scam is when some fake police will approach you, asking to look for 'drug money', or ask to see your document. This is a scam to take your money.",
//        Section_id = marihuanaId
//    },
//    new SectionTextsSE
//    {
//        Text = "Italy is NOT a gay-friendly country, however, slowly, the common opinions have been changed and gay are more tollerated, while most Italians are still disturbed by public displays of affection from same-sex couples; female solo travellers will feel safe, despite the constant attention of local male, it is a common understanding that if a girl will accept a conversation with a boy she meant to be interested in him. ",
//        Section_id = gayId
//    },
//    new SectionTextsSE
//    {
//        Text = "Trains in Italy are generally good value, there are different train types: high-speed trains (Frecciarossa, Frecciargento, Frecciabianca, Eurostar Italia), Intercity, regional trains (Regionali, Regionali Veloci).  Prices for fast trains are much higher than regional ones. There is a good number of bus providers going between bigger cities, too. A well-developed system of motorways allows to travel by car, everywhere, however both petrol and speedway high costs have to be taken in consideration. ",
//        Section_id = transportId
//    },
//    new SectionTextsSE
//    {
//        Text = "Tipping is not very common (as good manner you can add 5% when you pay the bill, if you liked the service). Majority of restaurants will already include a fee for service (called 'coperto'), it is around 1.5€ per person.",
//        Section_id = tippingId
//    },
//    new SectionTextsSE
//    {
//        Text = "A visit to Italy it goes together with a restaurant experience. As an easy rule of thumb it is better to avoid premises in touristic areas, as the quality of food will be low while prices will be higher than avarage. Every italian regions has its own specialties that vary from region to region, if not even from city to city. For instance risotto is from northern regions while spaghetti and pasta are mostly from South Italy. Pizza is originally from Napoli, the Neapolitan one is the only traditional pizza. In Italy you can find nearly 800 kinds of cheese, including the famous Parmigiano Reggiano, and over 400 types of sausages. Gelato (ice cream) is avalable in any bar, however at the gelateria is where to taste a better one.",
//        Section_id = restaurantId
//    },
//    new SectionTextsSE
//    {
//        Text = "Due to the big number of tourists, the hospitality industry offers opportunities for every budget, from camping to high class hotels, however, sleeping in Italy it is slightly expensive.  Hostels are not widely present, instead, farmstays are an increasingly popular way to experience Italy, particularly in rural areas. Prices and availability might be a concern, in peak seasons (summer along the coast and winter in the Alpine regions).",
//        Section_id = accommodationId
//    },
//};

//vm.Texts.AddRange(ddTexts);