using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Gloobster.ReqRes.Facebook;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Serilog;
using Microsoft.AspNet.Http;

namespace Gloobster.Portal.Controllers.Api.Registration
{
	[Route("api/[controller]")]
	public class FacebookUserController : BaseApiController
	{
		public IUserService UserService { get; set; }		
		public IComponentContext ComponentContext { get; set; }
		public ILogger Log { get; set; }

		public FacebookUserController(ILogger log, IUserService userService, IComponentContext componentContext, IDbOperations db) : base(db)
		{
			Log = log;
			UserService = userService;
			ComponentContext = componentContext;
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] FacebookUserAuthenticationRequest request)
		{
			var facebookAuthRequest = new SocAuthenticationDO
			{
				AccessToken = request.accessToken,
				UserId = request.userId,
				ExpiresAt = DateTime.UtcNow.AddSeconds(request.expiresIn)
			};

			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Facebook");		

			UserService.AccountDriver = accountDriver;

			UserLoggedResultDO result = await UserService.Validate(facebookAuthRequest, null);
			
			Request.HttpContext.Session.SetString(PortalConstants.UserSessionId, result.UserId);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString(),
				networkType = SocialNetworkType.Facebook
			};

			return new ObjectResult(response);			
		}
	}
}