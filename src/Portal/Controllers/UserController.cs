using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using System.Web.Security;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.WebApiObjects;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;

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

        
        [HttpPost]
		public async Task<IActionResult> Post([FromBody]PortalUserRequest request)
		{
			var portalUserDO = request.ToDoFromRequest();
			
			var result = await UserDomain.ValidateOrCreateUser(portalUserDO);
			
	        var response = new LoggedResponse
	        {
		        encodedToken = result.EncodedToken,
				status = result.Status.ToString()				
			};
			
			return new ObjectResult(response);
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