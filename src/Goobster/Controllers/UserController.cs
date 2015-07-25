using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common.DbEntity;
using Goobster.Portal.Services;
using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860


namespace Goobster.Portal.Controllers
{
    public class PortalBaseController
    {
        public PortalBaseController(IDbClass db)
        {
            DB = db;
        }


        public IDbClass DB;
    }
    


    [Route("api/[controller]")]
    public class UserController : PortalBaseController
    {
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
        public void Post(string mail, string password)
        {


            var newUser = new PortalUser
            {
                Mail = mail,
                Password = password
            };


            DB.Save(newUser);

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

        public UserController(IDbClass db) : base(db)
        {
        }
    }
}
