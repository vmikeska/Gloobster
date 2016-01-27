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
		public IUserService UserService { get; set; }
		public IComponentContext ComponentContext { get; set; }
		
		public GoogleUserController(IUserService userService, IComponentContext componentContext, ILogger log, IDbOperations db) : base(log, db)
		{
			UserService = userService;
			ComponentContext = componentContext;
		}

		[HttpPost]
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

            Dictionary<string, string> userParamsDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(l.ToString());
		    var userParamsVals = userParamsDict.Values.ToList();

            var userId = f.ToString();
            var tokenData = JsonConvert.DeserializeObject<GoogleTokenData>(s.ToString());

		    var userParams = new GoogleUserParams
		    {
		        UserId = userParamsVals[0],
		        FullName = userParamsVals[1],
		        FirstName = userParamsVals[2],
		        LastName = userParamsVals[3],
		        PhotoLink = userParamsVals[4],
		        Mail = userParamsVals[5]
		    };

            DateTime expiresAt = DateTime.UtcNow.AddSeconds(tokenData.expires_in);

            var auth = new SocAuthenticationDO
            {
                AccessToken = tokenData.access_token,
                ExpiresAt = expiresAt,
                UserId = userId,
            };

            var userDo = new GoogleUserRegistrationDO
            {
                DisplayName = userParams.FullName,
                ProfileLink = userParams.PhotoLink,
                Mail = userParams.Mail
            };

            var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Google");

            UserService.AccountDriver = accountDriver;

            var result = await UserService.Validate(auth, userDo);
            Request.HttpContext.Session.SetString(PortalConstants.UserSessionId, result.UserId);

            var r = new LoggedResponse
            {
                encodedToken = result.EncodedToken,
                status = result.Status.ToString(),
                networkType = SocialNetworkType.Google
            };

            return new ObjectResult(r);
        }
	}
}