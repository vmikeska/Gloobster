using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.User;
using Goobster.Portal.DomainModels;
using Goobster.Portal.Services;
using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860


namespace Goobster.Portal.Controllers
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
        public async void Post(string mail, string password)
        {
            var result  = await UserDomain.CreateUserBase(mail, password);

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
}
