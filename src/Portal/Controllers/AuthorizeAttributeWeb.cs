using Gloobster.Common;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Filters;
using Newtonsoft.Json;

namespace Gloobster.Portal.Controllers
{
    public class AuthorizeAttributeWeb : ActionFilterAttribute
    {       
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var controller = (Controller)context.Controller;
            
            var loginJson = controller.Request.Cookies["loginCookie"];
            if (loginJson.Count == 0)
            {
                context.HttpContext.Response.StatusCode = 401;
                return;                
            }
            var loginJsonObj = JsonConvert.DeserializeObject<dynamic>(loginJson);

            var authorizationToken = loginJsonObj.encodedToken.ToString();
            
            try
            {
                string decodedStr = JsonWebToken.Decode(authorizationToken, GloobsterConfig.AppSecret, true);
            }
            catch
            {
                context.HttpContext.Response.StatusCode = 401;
                return;
            }
            
            base.OnActionExecuting(context);
        }
    }
}