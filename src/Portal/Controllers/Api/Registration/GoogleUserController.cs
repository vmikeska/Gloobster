using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Gloobster.ReqRes.Google;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Registration
{
	[Route("api/[controller]")]
	public class GoogleUserController : BaseApiController
	{
		//public IUserService UserService { get; set; }
		public IComponentContext ComponentContext { get; set; }
        public ISocNetworkService SocNetService { get; set; }

        public GoogleUserController(ISocNetworkService socNetService, IComponentContext componentContext, ILogger log, IDbOperations db) : base(log, db)
		{
			SocNetService = socNetService;
            ComponentContext = componentContext;
		}

        [HttpPost]
        [AuthorizeApi]
        //public async Task<IActionResult> Post([FromBody] GoogleAuthResponse response)
        public async Task<IActionResult> Post([FromBody] dynamic response)
        {
            //this workaround was made so, because google doesn't return always class with same structure.
            var str = response.ToString();
            Dictionary<string, object> dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(str);

            List<object> vals = dict.Values.ToList();
            var f = vals.First();
            var s = vals[1];
            var l = vals.Last();
            
            var userId = f.ToString();
            var tokenData = JsonConvert.DeserializeObject<GoogleTokenData>(s.ToString());
            
            DateTime expiresAt = DateTime.UtcNow.AddSeconds(tokenData.expires_in);
            
            var auth = new SocAuthDO
            {
                UserId = UserId,
                AccessToken = tokenData.access_token,
                TokenSecret = null,
                ExpiresAt = expiresAt,
                SocUserId = userId,
                NetType = SocialNetworkType.Google
            };

            SocNetService.SocLogin = ComponentContext.ResolveKeyed<ISocLogin>("Google");
            
            var res = await SocNetService.HandleAsync(auth);
            return new ObjectResult(res);            
        }
    }
}