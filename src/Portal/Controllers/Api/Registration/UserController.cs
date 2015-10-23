using Microsoft.AspNet.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using Autofac;
using Gloobster.Common;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.WebApiObjects;
using Gloobster.Mappers;
using Gloobster.Portal.ReqRes;
using Gloobster.SocialLogin.Facebook.Communication;
using Gloobster.WebApiObjects.Facebook;
using Microsoft.AspNet.Http;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class UserController : Controller
	{
		public IUserService UserService { get; set; }
		public IComponentContext ComponentContext { get; set; }

		public UserController(IUserService userService, IComponentContext componentContext)
		{
			UserService = userService;
			ComponentContext = componentContext;
		}

		[HttpPost]
		public async Task<IActionResult> Post([FromBody] req reg)
		{
			var baseUser = new BaseUserDO
			{
				Mail = reg.mail,
				Password = reg.password
			};

			var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Base");

			UserService.AccountDriver = accountDriver;

			var result = await UserService.Validate(null, baseUser);
			Context.Session.SetString(PortalConstants.UserSessionId, result.UserId);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString()
			};

			return new ObjectResult(response);
		}

		public class req
		{
			public string mail { get; set; }
			public string password { get; set; }
		}


	}
}