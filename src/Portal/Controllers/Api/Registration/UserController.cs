using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Gloobster.ReqRes.User;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Registration
{
	[Route("api/[controller]")]
	public class UserController : BaseApiController
	{
		public IUserService UserService { get; set; }
		public IComponentContext ComponentContext { get; set; }
		
		public UserController(IUserService userService, IComponentContext componentContext, IDbOperations db) : base(db)
		{
			UserService = userService;
			ComponentContext = componentContext;
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] UserRegistrationRequest reg)
		{
			var baseUser = new BaseUserDO
			{
				Mail = reg.mail,
				Password = reg.password,
				Action = reg.action
			};

			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Base");

			UserService.AccountDriver = accountDriver;

			var result = await UserService.Validate(null, baseUser);
			Request.HttpContext.Session.SetString(PortalConstants.UserSessionId, result.UserId);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString()
			};

			return new ObjectResult(response);
		}

		


	}
}