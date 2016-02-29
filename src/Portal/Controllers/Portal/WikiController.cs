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
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
    public class WikiController : PortalBaseController
    {
        public WikiController(ILogger log,  IDbOperations db) : base(log, db)
		{
            
        }
    
	    public IActionResult City()
	    {
	        var aboutPoeopleId = ObjectId.GenerateNewId();

	        var vm = CreateViewModelInstance<WikiCityViewModel>();
            
            vm.Article = new WikiCityEntity
            {
                Sections = new List<SectionSE>
                {
                    new SectionSE
                    {
                        Type = "AboutPeople",
                        id = aboutPoeopleId
                    }
                },

                Data = new CityDataSE
                {
                    PopulationCity = 1244858,
                    PopulationMetro = 2484897,
                },

                Sites = new List<SiteSE>
                {
                    new SiteSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Name = "Colosseum"
                    },
                    new SiteSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Name = "Fori Imperiali"
                    },
                    new SiteSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Name = "Pantheon "
                    },
                    new SiteSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Name = "Fontana di Trevi"
                    },
                    new SiteSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Name = "Piazza di Spagna"
                    },
                    new SiteSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Name = "Vaticano and Piazza S. Pietro "
                    },
                    new SiteSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Name = "Piazza Navona"
                    },
                }

            };

            vm.Texts = new List<SectionTextsSE>
            {
                new SectionTextsCommonSE
                {
                    Title = "Prague",
                    BaseText = "Prague is one of the most beautiful historical cities in the world. Its large center, 866 hectares in size makes Prague unique history preservation. Prague is a popular night-life destination, with thousands of bars, pubs and clubs, happy to entertain any visitor, at any season, until early morning hours. Despite growing prices in last years, Prague is still considered as one of the cheapest metropoles in Europe with prices roughly one half of the West European standard."
                },
                new SectionTextsSE
                {
                    Section_id = aboutPoeopleId,
                    Text = "People of Prague are mostly nice, sometimes too much proud of this incredible city being built carefully for over 1000 years. If they share any language in common with you, they will gladly fall in chat with you."
                }
            };

            return View(vm);
		}
        
    


	}
}
