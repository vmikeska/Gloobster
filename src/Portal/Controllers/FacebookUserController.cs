using Microsoft.AspNet.Mvc;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.WebApiObjects;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class FacebookUserController : Controller
	{
		public IUserService UserService;
		public IFacebookDomain FBDomain;

		public FacebookUserController(IUserService userService, IFacebookDomain fbDomain)
		{
			UserService = userService;
			FBDomain = fbDomain;
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] FacebookUserAuthenticationRequest request)
		{
			var facebookAuthRequest = request.ToDoFromRequest();



			var accountDriver = new FacebookAccountDriver
			{
				DB = new DbOperations(),
				FBService = new FacebookService(),
				FBDomain = FBDomain
			};
			UserService.AccountDriver = accountDriver;

			var result = await UserService.Validate(facebookAuthRequest);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString()
			};

			return new ObjectResult(response);
		}
	}
}