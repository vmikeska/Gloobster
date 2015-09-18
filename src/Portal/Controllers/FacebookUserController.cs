using Microsoft.AspNet.Mvc;
using System.Threading.Tasks;
using Autofac;
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
			var facebookAuthRequest = request.ToDoFromRequest();

			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Facebook");
			
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