using System;
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
		{
			//todo: find what does it mean
			DateTime expiresAt = new DateTime(request.wc.expires_at);

			var auth = new SocAuthenticationDO
			{
				AccessToken = request.wc.access_token,
				ExpiresAt = expiresAt,
				UserId = request.El,
			};

			var userDo = new GoogleUserRegistrationDO
			{				
				DisplayName = request.Ld.ye,
				ProfileLink = request.Ld.Ei,
				Mail = request.Ld.Ld
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