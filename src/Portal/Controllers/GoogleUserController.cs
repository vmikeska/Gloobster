using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.Portal.ReqRes;
using Gloobster.WebApiObjects;
using Gloobster.WebApiObjects.Google;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class GoogleUserController : Controller
	{
		public IUserService UserService { get; set; }
		public IComponentContext ComponentContext { get; set; }

		public GoogleUserController(IUserService userService, IComponentContext componentContext)
		{
			UserService = userService;
			ComponentContext = componentContext;
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] GoogleAuthRequest request)
		{
			//todo: find what does it mean
			DateTime expiresAt = new DateTime(request.wc.expires_at);

			var userDo = new GoogleUserRegistrationDO
			{
				AccessToken = request.wc.access_token,
				ExpiresAt = expiresAt,
				UserId = request.El,
				DisplayName = request.Ld.ye,
				ProfileLink = request.Ld.Ei,
				Mail = request.Ld.Ld
			};

			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Google");

			UserService.AccountDriver = accountDriver;

			var result = await UserService.Validate(userDo);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString()
			};

			return new ObjectResult(response);
		}
	}
}