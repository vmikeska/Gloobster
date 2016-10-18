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
		public IComponentContext ComponentContext { get; set; }
        public ISocNetworkService SocNetService { get; set; }

        public GoogleUserController(ISocNetworkService socNetService, IComponentContext componentContext, ILogger log, IDbOperations db) : base(log, db)
		{
			SocNetService = socNetService;
            ComponentContext = componentContext;
		}

	    private void AddLog(string log)
	    {
	        Log.Debug($"GoogleUserC: {log}");
	    }

        [HttpPost]
        [AuthorizeApi]
        //public async Task<IActionResult> Post([FromBody] GoogleAuthResponse response)
        public async Task<IActionResult> Post([FromBody] dynamic response)
        {
            AddLog("New response from google");

            //this workaround was made so, because google doesn't return always class with same structure.
            var str = response.ToString();
            AddLog($"str: {str}");
            Dictionary<string, object> dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(str);
            AddLog($"dict created");
            List<object> vals = dict.Values.ToList();
            var f = vals.First();
            AddLog($"f: {f}");
            var s = vals[1];
            AddLog($"s: {s}");
            var l = vals.Last();
            AddLog($"l: {l}");


            var userId = f.ToString();
            var tokenData = JsonConvert.DeserializeObject<GoogleTokenData>(s.ToString());
            AddLog($"after token data");
            DateTime expiresAt = DateTime.UtcNow.AddSeconds(tokenData.expires_in);
            AddLog($"after expires");

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
            if (SocNetService.SocLogin != null)
            {
                AddLog($"soc login loaded");
            }

            AddLog($"Calling HandleAsync");
            var res = await SocNetService.HandleAsync(auth);
            AddLog($"Processed successfully");
            return new ObjectResult(res);            
        }

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete()
        {
            var res = await SocNetService.Unpair(UserId, SocialNetworkType.Google);
            return new ObjectResult(res);
        }
    }
}