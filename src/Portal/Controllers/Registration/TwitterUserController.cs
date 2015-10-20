using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common.CommonEnums;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Portal.ReqRes;
using Gloobster.WebApiObjects.Facebook;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Http;



namespace Gloobster.Portal.Controllers.Registration
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
			Context.Session.SetString(PortalConstants.UserSessionId, result.UserId);

			var response = new LoggedResponse
			{
				encodedToken = result.EncodedToken,
				status = result.Status.ToString(),
				networkType = SocialNetworkType.Twitter
			};

			return new ObjectResult(response);


			//var facebookAuthRequest = new SocAuthenticationDO
			//{
			//	AccessToken = request.accessToken,
			//	UserId = request.userID,
			//	ExpiresAt = DateTime.UtcNow.AddSeconds(request.expiresIn)
			//}; 

			//var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Facebook");

			//UserService.AccountDriver = accountDriver;

			//var result = await UserService.Validate(facebookAuthRequest, null);

			//Context.Session.SetString(PortalConstants.UserSessionId, result.UserId);

			//var response = new LoggedResponse
			//{
			//	encodedToken = result.EncodedToken,
			//	status = result.Status.ToString(),                
			//	networkType = SocialNetworkType.Facebook
			//};

			return new ObjectResult(response);
		}
	}
}