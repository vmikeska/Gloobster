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

namespace Gloobster.Portal.Controllers.Registration
{
	[Route("api/[controller]")]
	public class FacebookUserController : Controller
	{
		public IUserService UserService { get; set; }		
		public IComponentContext ComponentContext { get; set; }

		public FacebookUserController(IUserService userService, IComponentContext componentContext)
		{
			UserService = userService;			
			ComponentContext = componentContext;
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] FacebookUserAuthenticationRequest request)
		{			
			var facebookAuthRequest = new SocAuthenticationDO
			{
				AccessToken = request.accessToken,
				UserId = request.userID,
				ExpiresAt = DateTime.UtcNow.AddSeconds(request.expiresIn)
			}; 

			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Facebook");
			
			UserService.AccountDriver = accountDriver;

			var result = await UserService.Validate(facebookAuthRequest, null);

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