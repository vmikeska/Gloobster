using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.NewAdmin.Wiki
{
    [Route("api/[controller]")]
    public class WikiPageSectionController : BaseApiController
    {        
        public IWikiPermissions Permission { get; set; }

        public WikiPageSectionController(IWikiPermissions permission, ILogger log, IDbOperations db) : base(log, db)
        {
            Permission = permission;            
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] WikiPageSectionReq req)
        {
            if (!Permission.IsMasterAdmin(UserId))
            {
                throw new SecurityException();
            }


            if (req.type == WikiPageType.City)
            {
                var cities = DB.List<WikiCityEntity>();
                var citiesIds = cities.Select(c => c.id).ToList();
                var texts = DB.List<WikiTextsEntity>(t => citiesIds.Contains(t.Article_id));

                foreach (var city in cities)
                {
                    var section = new SectionSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Type = req.name
                    };

                    var f1 = DB.F<WikiCityEntity>().Eq(c => c.id, city.id);
                    var u1 = DB.U<WikiCityEntity>().Push(c => c.Sections, section);
                    await DB.UpdateAsync(f1, u1);

                    //todo: in future for all langs
                    var lang = "en";
                    var text = texts.FirstOrDefault(t => t.Article_id == city.id && t.Language == lang);
                    if (text != null)
                    {
                        var newTxt = new SectionTextsSE
                        {
                            Dislikes = new List<ObjectId>(),
                            Likes = new List<ObjectId>(),
                            Rating = 0,
                            Section_id = section.id,
                            Text = string.Empty
                        };

                        var f2 = DB.F<WikiTextsEntity>().Eq(c => c.Article_id, city.id);
                        var u2 = DB.U<WikiTextsEntity>().Push(c => c.Texts, newTxt);
                        await DB.UpdateAsync(f2, u2);                        
                    }

                }
            }


            if (req.type == WikiPageType.Country)
            {
                var countries = DB.List<WikiCountryEntity>();
                var countriesIds = countries.Select(c => c.id).ToList();
                var texts = DB.List<WikiTextsEntity>(t => countriesIds.Contains(t.Article_id));

                foreach (var country in countries)
                {
                    var section = new SectionSE
                    {
                        id = ObjectId.GenerateNewId(),
                        Type = req.name
                    };

                    var f1 = DB.F<WikiCountryEntity>().Eq(c => c.id, country.id);
                    var u1 = DB.U<WikiCountryEntity>().Push(c => c.Sections, section);
                    await DB.UpdateAsync(f1, u1);

                    //todo: in future for all langs
                    var lang = "en";
                    var text = texts.FirstOrDefault(t => t.Article_id == country.id && t.Language == lang);
                    if (text != null)
                    {
                        var newTxt = new SectionTextsSE
                        {
                            Dislikes = new List<ObjectId>(),
                            Likes = new List<ObjectId>(),
                            Rating = 0,
                            Section_id = section.id,
                            Text = string.Empty
                        };

                        var f2 = DB.F<WikiTextsEntity>().Eq(c => c.Article_id, country.id);
                        var u2 = DB.U<WikiTextsEntity>().Push(c => c.Texts, newTxt);
                        await DB.UpdateAsync(f2, u2);
                    }

                }
            }

            return new ObjectResult(null);
        }

        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get(WikiPageSectionGet req)
        {
            if (!Permission.IsMasterAdmin(UserId))
            {
                throw new SecurityException();
            }

            var results = new List<WikiPageSectionResult>();

            if (req.type == WikiPageType.City)
            {
                var cities = DB.List<WikiCityEntity>();
                List<SectionSE> sections = cities.SelectMany(c => c.Sections).ToList();

                var types = sections.Select(s => s.Type).Distinct().ToList();
                
                foreach (var type in types)
                {
                    var msg = string.Empty;
                    foreach (var city in cities)
                    {
                        var sect = city.Sections.FirstOrDefault(s => s.Type == type);
                        if (sect == null)
                        {
                            msg += city.id;
                        }
                    }

                    var res = new WikiPageSectionResult
                    {
                        type = type,
                        msg = msg
                    };

                    results.Add(res);
                }
            }

            if (req.type == WikiPageType.Country)
            {
                var countries = DB.List<WikiCountryEntity>();
                List<SectionSE> sections = countries.SelectMany(c => c.Sections).ToList();

                var types = sections.Select(s => s.Type).Distinct().ToList();

                foreach (var type in types)
                {
                    var msg = string.Empty;
                    foreach (var city in countries)
                    {
                        var sect = city.Sections.FirstOrDefault(s => s.Type == type);
                        if (sect == null)
                        {
                            msg += city.id;
                        }
                    }

                    var res = new WikiPageSectionResult
                    {
                        type = type,
                        msg = msg
                    };

                    results.Add(res);
                }
            }

            return new ObjectResult(results);
        }


        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(WikiPageSectionDeleteRequest req)
        {
            if (!Permission.IsMasterAdmin(UserId))
            {
                throw new SecurityException();
            }

            if (req.pt == WikiPageType.City)
            {                
                var cities = DB.List<WikiCityEntity>();
                var citiesIds = cities.Select(c => c.id).ToList();
                var texts = DB.List<WikiTextsEntity>(t => citiesIds.Contains(t.Article_id));

                foreach (var city in cities)
                {
                    var section = city.Sections.FirstOrDefault(s => s.Type == req.st);
                    if (section == null)
                    {
                        continue;
                    }

                    var f1 = DB.F<WikiCityEntity>().Eq(c => c.id, city.id);
                    var u1 = DB.PF<WikiCityEntity, SectionSE>(s => s.Sections, a => a.Type == req.st);                  
                    var sectDelRes = await DB.UpdateAsync(f1, u1);
                    
                    //todo: in future for all langs
                    var lang = "en";
                    var text = texts.FirstOrDefault(t => t.Article_id == city.id && t.Language == lang);
                    if (text != null)
                    {
                        var f2 = DB.F<WikiTextsEntity>().Eq(c => c.Article_id, city.id);
                        var u2 = DB.PF<WikiTextsEntity, SectionTextsSE>(c => c.Texts, t => t.Section_id == section.id);
                        var textDelRes = await DB.UpdateAsync(f2, u2);
                    }

                }
            }

            if (req.pt == WikiPageType.Country)
            {
                var countries = DB.List<WikiCountryEntity>();
                var countriesIds = countries.Select(c => c.id).ToList();
                var texts = DB.List<WikiTextsEntity>(t => countriesIds.Contains(t.Article_id));

                foreach (var city in countries)
                {
                    var section = city.Sections.FirstOrDefault(s => s.Type == req.st);

                    if (section == null)
                    {
                        continue;
                    }

                    var f1 = DB.F<WikiCountryEntity>().Eq(c => c.id, city.id);
                    var u1 = DB.PF<WikiCountryEntity, SectionSE>(s => s.Sections, a => a.Type == req.st);
                    var sectDelRes = await DB.UpdateAsync(f1, u1);
                    
                    //todo: in future for all langs
                    var lang = "en";
                    var text = texts.FirstOrDefault(t => t.Article_id == city.id && t.Language == lang);
                    if (text != null)
                    {
                        var f2 = DB.F<WikiTextsEntity>().Eq(c => c.Article_id, city.id);
                        var u2 = DB.PF<WikiTextsEntity, SectionTextsSE>(c => c.Texts, t => t.Section_id == section.id);
                        var textDelRes = await DB.UpdateAsync(f2, u2);
                    }

                }
            }

            return new ObjectResult(null);
        }

    }

    public class WikiPageSectionDeleteRequest
    {
        public WikiPageType pt { get; set; }
        public string st { get; set; }
    }

    public class WikiPageSectionResult
    {        
        public string type { get; set; }
        public string msg { get; set; }
    }

    public enum WikiPageType { City, Country}

    public class WikiPageSectionGet
    {
        public WikiPageType type { get; set; }
    }

    public class WikiPageSectionReq
    {
        public WikiPageType type { get; set; }
        public string name { get; set; }
    }
}