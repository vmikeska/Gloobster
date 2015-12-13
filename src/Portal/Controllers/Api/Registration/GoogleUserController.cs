using System;
using System.IO;
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

namespace Gloobster.Portal.Controllers.Api.Registration
{
	[Route("api/[controller]")]
	public class GoogleUserController : BaseApiController
	{
		public IUserService UserService { get; set; }
		public IComponentContext ComponentContext { get; set; }
		
		public GoogleUserController(IUserService userService, IComponentContext componentContext, IDbOperations db) : base(db)
		{
			UserService = userService;
			ComponentContext = componentContext;
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] GoogleAuthRequest request)
		//public async Task<IActionResult> Post([FromBody] dynamic request)
		{
			DateTime expiresAt = DateTime.UtcNow.AddSeconds(request.po.expires_in);

			var auth = new SocAuthenticationDO
			{
				AccessToken = request.po.access_token,
				ExpiresAt = expiresAt,
				UserId = request.El,
			};

			var userDo = new GoogleUserRegistrationDO
			{
				DisplayName = request.zt.zt,
				ProfileLink = request.zt.Ei,
				Mail = request.zt.po
			};

			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Google");

			UserService.AccountDriver = accountDriver;

			var result = await UserService.Validate(auth, userDo);
			Request.HttpContext.Session.SetString(PortalConstants.UserSessionId, result.UserId);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString(),
				networkType = SocialNetworkType.Google
			};

			return new ObjectResult(response);
		}
	}
}