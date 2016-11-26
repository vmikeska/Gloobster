using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Planning;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Planning;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Planning
{
	[Route("api/[controller]")]
	public class CustomSearchController : BaseApiController
	{						
		public ICustomSearchDomain SearchDomain { get; set; }
		
		public CustomSearchController(ICustomSearchDomain searchDomain, ILogger log, IDbOperations db) : base(log, db)
		{			
			DB = db;
            SearchDomain = searchDomain;			
		}

		private PlanningPropRequest Req;

		[HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody] CustomSearchPostReq req)
		{
		    if (req.actionName == "new")
		    {
		        CustomSearchDO searchDo = await SearchDomain.CreateNewSearch(UserId);
		        var res = searchDo.ToResponse();
                return new ObjectResult(res);
            }
            
			return new ObjectResult(null);
		}


		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] CustomSearchUpdateReq req)
		{

		    if (req.name == "daysRange")
		    {
		        int from = int.Parse(req.GetValByName("from"));
                int to = int.Parse(req.GetValByName("to"));

                await SearchDomain.UpdateDaysRange(UserId, req.id, from, to);
		    }
            
            if (req.name == "dep")
            {
                Date date = req.value.ToDate('_');
                await SearchDomain.UpdateDeparature(UserId, req.id, date);
            }

            if (req.name == "arr")
            {
                Date date = req.value.ToDate('_');
                await SearchDomain.UpdateArrival(UserId, req.id, date);
            }

            if (req.name == "stdAir")
            {
                var state = bool.Parse(req.value);
                await SearchDomain.UpdateStandardAir(UserId, req.id, state);
            }
            
            if (req.name == "custAir")
            {               
                string text = req.GetValByName("text");
                int origId = int.Parse(req.GetValByName("origId"));
                
                await SearchDomain.AddCustomAir(UserId, req.id, text, origId);
            }
            
            if (req.name == "name")
            {
                await SearchDomain.UpdateName(UserId, req.id, req.value);
            }
            
		    return new ObjectResult(null);
		}

        [HttpDelete]
        [AuthorizeApi]
        public IActionResult Delete(CustomSearchDelReq req)
        {
            if (req.actionName == "search")
            {
                SearchDomain.DeleteSearch(UserId, req.id);
            }

            if (req.actionName == "air")
            {
                int origId = int.Parse(req.paramId);
                SearchDomain.RemoveCustomAir(UserId, req.id, origId);
            }

            return new ObjectResult(null);
        }


        [HttpGet]
		[AuthorizeApi]
		public IActionResult Get(CustomSearchGetReq req)
		{
            var custom = DB.FOD<PlanningCustomEntity>(p => p.User_id == UserIdObj);

            if (req.actionName == "init")
		    {
                var headers = custom.Searches.Select(s => new CustomSearchHeaderResponse
                {
                    id = s.id.ToString(),
                    name = s.Name
                }).ToList();

		        var resp = new PlanningCustomResponse
		        {
		            headers = headers,
		        };

		        if (custom.Searches.Any())
		        {
		            resp.first = custom.Searches.First().ToResponse();
		        }

                return new ObjectResult(resp);                
            }

		    if (req.actionName == "search")
		    {
		        var searchIdObj = new ObjectId(req.id);
                CustomSearchSE search = custom.Searches.FirstOrDefault(f => f.id == searchIdObj);
		        var resp = search.ToResponse();

                return new ObjectResult(resp);
            }
            
			return new ObjectResult(null);
		}		
	}

    public class CustomSearchUpdateReq
    {
        public string id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public List<NameValReq> values { get; set; }

        public string GetValByName(string n)
        {
            var obj = values.FirstOrDefault(f => f.name == n);
            return obj.val;
        }
    }

    public class NameValReq
    {
        public string name { get; set; }
        public string val { get; set; }
    }

    public class CustomSearchGetReq
    {
        public string actionName { get; set; }
        public string id { get; set; }
    }

    public class CustomSearchDelReq
    {
        public string actionName { get; set; }
        public string id { get; set; }
        public string paramId { get; set; }
    }

    public class CustomSearchPostReq
    {
        public string actionName { get; set; }
    }
}