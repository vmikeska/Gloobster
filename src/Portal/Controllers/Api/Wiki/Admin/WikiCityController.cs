using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
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
            //temp
            if (string.IsNullOrEmpty(req.lang))
            {
                req.lang = "en";
            }

            //todo: implement full functionality
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