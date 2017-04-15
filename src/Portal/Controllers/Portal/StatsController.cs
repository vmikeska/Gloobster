using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using Autofac;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.Portal.ViewModels;

namespace Gloobster.Portal.Controllers.Portal
{
    public class StatsController : PortalBaseController
    {
        public StatsController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }

        private static List<Page> Pages = new List<Page> {

            new Page {
                Link = "left-right-driving-countries",
                Title = "Left-Right driving in countries",
                Scripts = new List<Script> {
                    new Script {FileName = "CountriesDriving", Namespace = "Stats"},
                    //new Script {FileName = "CountriesData", Namespace = "Deals/Map"}
                }
            },

            new Page {
                Link = "population-density",
                Title = "Population density",
                Scripts = new List<Script> {
                    new Script {FileName = "PopulationDensity", Namespace = "Stats"}
                }
            }


        };

        public IActionResult Stat(string id)
        {
            var page = Pages.FirstOrDefault(f => f.Link == id);

            var vm = CreateViewModelInstance<StatViewModel>();
            vm.Page = page;

            //vm.DefaultLangModuleName = "pageAbout";
            //vm.LoadClientTexts();

            return View(vm);
        }

    }

    public class Page
    {
        public string Link { get; set; }
        public string Title { get; set; }
        public List<Script> Scripts { get; set; }

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
