using System.IO;
using System.Net;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Wiki;
using Gloobster.DomainObjects;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class PricesInitializer
    {
        private string ReadFile(string name)
        {
            var link = $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/prices/{name}.json";

            using (var client = new WebClient())
            {
                string str = client.DownloadString(link);
                return str;
            }
        }

        public void InitPrices()
        {
            var beerText = ReadFile("BeerPrices");
            var pricesText = ReadFile("OtherPrices");
            DefaultPricer.Parse(beerText, pricesText);
        }
    }


    public class WikiCityController : BaseApiController
    {
        public IWikiArticleDomain ArticleDomain { get; set; }

        public WikiCityController(IWikiArticleDomain articleDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            ArticleDomain = articleDomain;
        }

        



        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] WikiCityRequest req)
        {

            var pi = new PricesInitializer();
            pi.InitPrices();

            //temp
            if (string.IsNullOrEmpty(req.lang))
            {
                req.lang = "en";
            }
            
            //http://api.geonames.org/getJSON?username=gloobster&id=3078610&formatted=true
            var cityDO = new CityDO
            {
                Name = req.title,
                AsciiName = req.title,
                CountryCode = req.countryCode,
                GID = req.gid,
                Population = req.population
            };

            string cityId = ArticleDomain.CreateCity(cityDO, req.lang);

            return new ObjectResult(true);
        }
    }

    public class WikiCityRequest
    {
        public int gid {get; set; }
        public int population { get; set; }
        public string title { get; set; }
        public string lang { get; set; }
        public string countryCode { get; set; }
    }
}