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
        public IGeoNamesService GNS { get; set; }

        public DealsPlaceController(IGeoNamesService gns, INewAirportCache newAirCache, ICountryService countrySvc,
            ILogger log, IDbOperations db) : base(log, db)
        {
            CountrySvc = countrySvc;
            NewAirCache = newAirCache;
            GNS = gns;
        }

        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get(DelasPlaceGet req)
        {
            if (req.byId)
            {
                if (req.type == DealsPlaceTypes.Country)
                {
                    var country = CountrySvc.GetCountryByCountryCode2(req.id);
                    var c = BuildCountry(country);
                    return new ObjectResult(c);
                }
                if (req.type == DealsPlaceTypes.City)
                {
                    var gid = int.Parse(req.id);
                    var air = NewAirCache.GetAirportByGID(gid);
                    var c = BuildCity(air);
                    return new ObjectResult(c);
                }
                if (req.type == DealsPlaceTypes.CityAir)
                {
                    var air = NewAirCache.GetAirportByAirCode(req.id);
                    var c = BuildCityAir(air);
                    return new ObjectResult(c);
                }
            }

            //list query from here

            var ltxt = string.IsNullOrEmpty(req.txt) ? string.Empty : req.txt.ToLower();

            var countries = GetCountries(ltxt);
            var airs = GetAirports(ltxt);

            var items = new List<DealsPlaceItem>();

            var ci = countries.Select(BuildCountry).ToList();

            items.AddRange(ci);

            List<IGrouping<int, NewAirportEntity>> cityGroups = airs.GroupBy(g => g.GID).ToList();

            foreach (var cityGroup in cityGroups)
            {
                List<NewAirportEntity> airports = cityGroup.ToList();

                var cityAir = airports.First();

                var cityItem = BuildCity(cityAir);
                items.Add(cityItem);

                bool multiCity = airports.Count > 1;
                if (multiCity)
                {
                    foreach (var air in airports)
                    {
                        var cityAirItem = BuildCityAir(air);
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

        private DealsPlaceItem BuildCity(NewAirportEntity air)
        {
            var cityItem = new DealsPlaceItem
            {
                name = air.Name,
                air = air.Code,
                cc = air.CountryCode,
                type = DealsPlaceTypes.City,
                gid = air.GID,
                isMulti = true,
                childern = new List<DealsPlaceItem>()
            };
            return cityItem;
        }

        private DealsPlaceItem BuildCityAir(NewAirportEntity air)
        {
            var cityAirItem = new DealsPlaceItem
            {
                name = air.Name,
                air = air.Code,
                cc = air.CountryCode,
                type = DealsPlaceTypes.CityAir,
                isMulti = false,
                childern = null
            };
            return cityAirItem;
        }

        private DealsPlaceItem BuildCountry(Country c)
        {
            return new DealsPlaceItem
            {
                name = c.CountryName,
                air = string.Empty,
                cc = c.CountryCode,
                type = DealsPlaceTypes.Country
            };
        }

    }

    public class DealsPlaceItem
    {
        public string name { get; set; }                
        public string cc { get; set; }
        public string air { get; set; } 
        public int gid { get; set; }      
        public DealsPlaceTypes type { get; set; }
        public bool isMulti { get; set; }
        public List<DealsPlaceItem> childern { get; set; }
    }

    public enum DealsPlaceTypes { Country, City, CityAir }
    
    public class DelasPlaceGet
    {
        public bool byId { get; set; }
        public string id { get; set; }
        public DealsPlaceTypes type { get; set; }

        public string txt { get; set; }
        public int max { get; set; }
    }
}