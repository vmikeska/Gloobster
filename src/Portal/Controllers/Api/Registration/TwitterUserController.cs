using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.ReqRes;
using Gloobster.ReqRes.Facebook;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Registration
{
	[Route("api/[controller]")]
	public class TwitterUserController : Controller
	{
		public IUserService UserService { get; set; }		
		public IComponentContext ComponentContext { get; set; }

		public TwitterUserController(IUserService userService, IComponentContext componentContext)
		{
			UserService = userService;			
			ComponentContext = componentContext;
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] TwitterUserAuthenticationRequest request)
		{
			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Twitter");
			UserService.AccountDriver = accountDriver;

			var addInfo = new TwitterUserAddtionalInfoDO
			{
				Mail = request.mail
			};

			var auth = new SocAuthenticationDO
			{
				AccessToken = request.accessToken,
				UserId = request.userId,
				TokenSecret = request.tokenSecret,
				ExpiresAt = DateTime.Parse(request.expiresAt)
			};

			var result = await UserService.Validate(auth, addInfo);
			Request.HttpContext.Session.SetString(PortalConstants.UserSessionId, result.UserId);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString(),
				networkType = SocialNetworkType.Twitter
			};

			return new ObjectResult(response);			
		}
	}
}