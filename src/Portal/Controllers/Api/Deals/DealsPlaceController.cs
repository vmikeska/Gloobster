using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Deals
{
    [Route("api/[controller]")]
    public class DealsPlaceController : BaseApiController
    {	
        public ICountryService CountrySvc { get; set; }
        public INewAirportCache NewAirCache { get; set; }

        public DealsPlaceController(INewAirportCache newAirCache, ICountryService countrySvc, ILogger log, IDbOperations db) : base(log, db)
        {
            CountrySvc = countrySvc;
            NewAirCache = newAirCache;
        }
        
        //[HttpPost]
        //[AuthorizeApi]
        //public async Task<IActionResult> Post([FromBody] CustomSearchPostReq req)
        //{

        //	return new ObjectResult(null);
        //}
        
        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get(DelasPlaceGet req)
        {
            var ltxt = string.IsNullOrEmpty(req.txt) ? string.Empty : req.txt.ToLower();

            var countries = GetCountries(ltxt);
            var airs = GetAirports(ltxt);
            
            var items = new List<DealsPlaceItem>();

            var ci = countries.Select(c => new DealsPlaceItem
            {
                name = c.CountryName,
                air = string.Empty,
                cc = c.CountryCode,
                type = DealsPlaceTypes.Country
            }).ToList();

            items.AddRange(ci);

            List<IGrouping<int, NewAirportEntity>> cityGroups = airs.GroupBy(g => g.GID).ToList();

            foreach (var cityGroup in cityGroups)
            {
                List<NewAirportEntity> airports = cityGroup.ToList();


                var cityAir = airports.First();

                var cityItem = new DealsPlaceItem
                {
                    name = cityAir.Name,
                    air = cityAir.Code,
                    cc = cityAir.CountryCode,
                    type = DealsPlaceTypes.City,
                    gid = cityAir.GID,
                    childern = new List<DealsPlaceItem>()
                };
                items.Add(cityItem);
                
                bool multiCity = airports.Count > 1;
                if (multiCity)
                {
                    foreach (var air in airports)
                    {
                        var cityAirItem = new DealsPlaceItem
                        {
                            name = air.Name,
                            air = air.Code,
                            cc = air.CountryCode,
                            type = DealsPlaceTypes.CityAir,
                            childern = null
                        };
                        cityItem.childern.Add(cityAirItem);
                    }                    
                }
            }

            var oItems = items.OrderBy(o => o.name).ToList();

            var tItems = oItems.Take(req.max);
            
            return new ObjectResult(tItems);
        }

        private List<NewAirportEntity> GetAirports(string ltxt)
        {
            var airs = new List<NewAirportEntity>();
            var airsByCity = NewAirCache.GetAirportsByCityStarting(ltxt);
            var airsByCode = NewAirCache.GetAirportsByAirCodeStarting(ltxt);
            airs.AddRange(airsByCity);
            airs.AddRange(airsByCode);

            var uniqAirs = airs.GroupBy(g => g.Code).Select(g => g.First()).ToList();
            return uniqAirs;
        }

        private List<Country> GetCountries(string ltxt)
        {
            var countries = new List<Country>();
            var countriesByName = CountrySvc.GetByCountryNameStarting(ltxt);
            var countriesByCode = CountrySvc.GetCountryByCountryCode2Starting(ltxt);
            countries.AddRange(countriesByName);
            countries.AddRange(countriesByCode);

            var cd = countries.GroupBy(g => g.CountryCode).Select(s => s.First()).ToList();
            return cd;
        }
    }

    public class DealsPlaceItem
    {
        public string name { get; set; }                
        public string cc { get; set; }
        public string air { get; set; } 
        public int gid { get; set; }      
        public DealsPlaceTypes type { get; set; }
        public List<DealsPlaceItem> childern { get; set; }
    }

    public enum DealsPlaceTypes { Country, City, CityAir }
    
    public class DelasPlaceGet
    {
        public string txt { get; set; }
        public int max { get; set; }
    }
}