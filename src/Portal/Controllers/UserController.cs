// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860


using Gloobster.DomainModelsCommon.User;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using Gloobster.Common.DbEntity;

namespace Gloobster.Portal.Controllers
{
	
	[Route("api/[controller]")]
    public class UserController : Controller
        //PortalBaseController
    {
        public IPortalUserDomain UserDomain;

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
			bool isFromFacebook = request.facebookUser != null;

			if (isFromFacebook)
			{
				//await UserDomain.FacebookUserExists()
            }


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

        public UserController(IPortalUserDomain userDomain)
        {
            UserDomain = userDomain;
        }

        //public UserController(IDbOperations db, IPortalUserDomain userDomain) : base(db)
        //{
        //    UserDomain = userDomain;
        //}
    }

	public class PortalUserRequest
	{
		public string displayName { get; set; }
		public string password { get; set; }
		public string mail { get; set; }
		public FacebookUserRequest facebookUser { get; set; }
	}

	public class FacebookUserRequest
	{
		public string accessToken { get; set; }
		public string userID { get; set; }
		public int expiresIn { get; set; }
		public string signedRequest { get; set; }
	}



	public static class Mappers
	{
		public static PortalUserDO ToDO(this PortalUserEntity entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new PortalUserDO
			{
				DisplayName = entity.DisplayName,
				Mail = entity.Mail,
				Password = entity.Password
			};

			return dObj;
		}

		public static PortalUserEntity ToEntity(this PortalUserDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new PortalUserEntity
			{
				DisplayName = dObj.DisplayName,
				Mail = dObj.Mail,
				Password = dObj.Password
			};

			return entity;
		}


	}
}


//debug
//([FromBody] JObject json)
//var tst2 = new StreamReader(Request.Body).ReadToEndAsync().Result;