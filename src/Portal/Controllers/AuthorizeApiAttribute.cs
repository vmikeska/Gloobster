using System;
using Gloobster.Common;
using Gloobster.DomainModels;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Filters;
using Newtonsoft.Json;

namespace Gloobster.Portal.Controllers
{
    public class AuthorizeApiAttribute : ActionFilterAttribute
	{
        public bool ExplicitAuth { get; set; }
        
        public AuthorizeApiAttribute(bool explicitAuth = false)
        {
            ExplicitAuth = explicitAuth;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //var controller = (Controller)context.Controller;
            string authorizationToken = context.HttpContext.Request.Headers["Authorization"];

            string decodedStr = string.Empty;

            try
            {
                decodedStr = JsonWebToken.Decode(authorizationToken, GloobsterConfig.AppSecret, true);
            }
            catch
            {
                //context.HttpContext.Response.StatusCode = 401;
                if (!ExplicitAuth)
                {
                    context.Result = new HttpStatusCodeResult(401);
                }
                return;
            }

            var tokenObj = JsonConvert.DeserializeObject<UserToken>(decodedStr);

            ((BaseApiController)context.Controller).UserId = tokenObj.UserId;

            base.OnActionExecuting(context);
        }

        //public override void OnActionExecuting(ActionExecutingContext context)
        //{            
        //          var controller = (Controller)context.Controller;
        //	string authorizationToken = controller.Request.Headers["Authorization"];

        //          string decodedStr = string.Empty;

        //	try
        //	{
        //		decodedStr = JsonWebToken.Decode(authorizationToken, GloobsterConfig.AppSecret, true);
        //	}
        //	catch
        //	{
        //              //context.HttpContext.Response.StatusCode = 401;
        //	    if (!ExplicitAuth)
        //	    {
        //	        context.Result = new HttpStatusCodeResult(401);                    
        //	    }
        //	    return;
        //	}

        //	var tokenObj = JsonConvert.DeserializeObject<AuthorizationToken>(decodedStr);

        //	((BaseApiController)context.Controller).UserId = tokenObj.UserId;

        //	base.OnActionExecuting(context);
        //}
    }
}