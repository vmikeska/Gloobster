using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	//http://127.0.0.1:4441/api/TwitterAuth?oauth_token=N4BBTwAAAAAAhaTcAAABT8uUf1g&oauth_verifier=OZvuJWf1XVaupHbI8JvetAuUhZnEbJZm

	[Route("api/[controller]")]
    public class TwitterAuthController : Controller
    {
        // GET: api/values
        [HttpGet]
        public void Get(string oauth_token, string oauth_verifier)
        {

            
        }
		
    }
}
