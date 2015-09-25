using Microsoft.AspNet.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.WebApiObjects;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using Gloobster.WebApiObjects.Facebook;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class UserController : Controller
	{
		public IUserService UserService;

		public UserController(IUserService userService)
		{
			UserService = userService;
		}

		[HttpPost]
		public Task<IActionResult> Post([FromBody] PortalUserRequest request)
		{
			//var facebookAuthRequest = request.ToDoFromRequest();

			//var accountDriver = new FacebookAccountDriver
			//{
			//	DB = new DbOperations(),
			//	FBService = new FacebookService()
			//};
			//UserService.AccountDriver = accountDriver;

			//var result = await UserService.Validate(facebookAuthRequest);

			//var response = new LoggedResponse
			//{
			//	encodedToken = result.EncodedToken,
			//	status = result.Status.ToString()
			//};

			//return new ObjectResult(response);
			return null;
		}
	}
}