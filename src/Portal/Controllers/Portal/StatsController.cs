using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using Autofac;
using FourSquare.SharpSquare.Entities;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.Portal.ViewModels;

namespace Gloobster.Portal.Controllers.Portal
{    
    public class StatsController : PortalBaseController
    {
        public StatsController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }
        
        public IActionResult Stat(string id)
        {
            var page = StatisticPages.Pages.FirstOrDefault(f => f.Link == id);

            var vm = CreateViewModelInstance<StatViewModel>();
            vm.Page = page;

            //vm.DefaultLangModuleName = "pageAbout";
            //vm.LoadClientTexts();

            return View(vm);
        }

    }

    public class StatisticPages
    {
        public static List<Page> Pages = new List<Page> {

            new Page {
                Link = "world-population-density-map",
                Title = "World population density heatmap",
                Description = "World population cities heatmap. Just only cities above 10.000 inhabitants are involved in the visualization.",

                Source = new Source
                {
                    Name = "GeoNames",
                    Link = "http://www.geonames.org/",
                    Year = 2017
                },

                Scripts = new List<Script> {
                    new Script {FileName = "PopulationDensity", Namespace = "Stats"}
                }
            },

            new Page {
                Link = "left-right-driving-countries-map",
                Title = "Left-Right driving in countries map",
                Description = "Visualized 2D countries by left/right side driving",

                Source = new Source
                {
                    Name = "Wikipedia",
                    Link = "https://en.wikipedia.org/wiki/Right-_and_left-hand_traffic",
                    Year = 2017
                },

                Scripts = new List<Script> {
                    new Script {FileName = "CountriesDriving", Namespace = "Stats"},
                    //new Script {FileName = "CountriesData", Namespace = "Deals/Map"}
                }
            },

            


        };
    }

    public class Page
    {
        public string Link { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Source Source { get; set; }
        public List<Script> Scripts { get; set; }

    }

    public class Source
    {
        public string Link { get; set; }
        public string Name { get; set; }
        public int Year { get; set; }
    }

    public class Script
    {
        public string FileName { get; set; }
        public string Namespace { get; set; }
    }

    //class ttt
    //{
    //    public string country { get; set; }
    //    public string cc { get; set; }
    //    public bool isRight { get; set; }
    //}

    //var ccs = new CountryService();

    //var objs = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ttt>>(cs);

    //foreach (var obj in objs)
    //{
    //    string cc = obj.country;

    //    var c = ccs.GetByCountryName(obj.country);
    //    if (c != null)
    //    {
    //        cc = c.CountryCode;
    //    }

    //    obj.cc = cc;
    //}

    //var str = Newtonsoft.Json.JsonConvert.SerializeObject(objs);

}
