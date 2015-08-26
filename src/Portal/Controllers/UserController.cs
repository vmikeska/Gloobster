using Gloobster.DomainModelsCommon.User;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using Gloobster.Common.DbEntity;
using Gloobster.WebApiObjects;
using Gloobster.Mappers;

namespace Gloobster.Portal.Controllers
{
	
	[Route("api/[controller]")]
    public class UserController : Controller
        //PortalBaseController
    {
        public IPortalUserDomain UserDomain;

		public UserController(IPortalUserDomain userDomain)
		{
			UserDomain = userDomain;
		}


		// GET: api/values
		[HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
		public async void Post([FromBody]PortalUserRequest request)
		{
			var portalUserDO = request.ToDoFromRequest();

			await UserDomain.ValidateOrCreateUser(portalUserDO);




			//var result  = await UserDomain.CreateUserBase(mail, password);

			//todo: handle results
		}

		// PUT api/values/5
		[HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
		
    }

	
	
}


//debug
//([FromBody] JObject json)
//var tst2 = new StreamReader(Request.Body).ReadToEndAsync().Result;