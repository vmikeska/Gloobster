using System;
using Gloobster.Common;
using Gloobster.DomainModels;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	public class AuthorizeAttribute : ActionFilterAttribute
	{

		public override void OnActionExecuting(ActionExecutingContext context)
		{
			var controller = (Controller)context.Controller;
			string authorizationToken = controller.Request.Headers["Authorization"];

			string decodedStr = string.Empty;

			try
			{
				decodedStr = JsonWebToken.Decode(authorizationToken, GloobsterConfig.AppSecret, true);
			}
			catch (Exception exception)
			{
				context.HttpContext.Response.StatusCode = 401;
				return;
			}
			
			var tokenObj = Newtonsoft.Json.JsonConvert.DeserializeObject<AuthorizationToken>(decodedStr);
			
			context.ActionArguments.Add("userId", tokenObj.UserId);

			base.OnActionExecuting(context);
		}
	}
}