

using Gloobster.Common;
using Gloobster.DomainModels;
using Gloobster.Portal.ReqRes;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Http;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers
{
    public class PortalBaseController: Controller
    {
	    private string _userId;
		public string UserId
		{
			get
			{
				if (!string.IsNullOrEmpty(_userId))
				{
					return _userId;
				}

				string userId = Context.Session.GetString(PortalConstants.UserSessionId);
				if (!string.IsNullOrEmpty(userId))
				{
					return userId;
				}

				var authToken = GetAuthorizationTokenFromCookie();
				if (authToken == null)
				{
					return string.Empty;
				}

				Context.Session.SetString(PortalConstants.UserSessionId, authToken.UserId);
				_userId = authToken.UserId;
				
				return _userId;
			}
		}

	    private AuthorizationToken GetAuthorizationTokenFromCookie()
	    {
			string cookieValue = Context.Request.Cookies[PortalConstants.LoginCookieName];

			if (string.IsNullOrEmpty(cookieValue))
			{
				return null;
			}

			try
			{
				var loggedObj = Newtonsoft.Json.JsonConvert.DeserializeObject<LoggedResponse>(cookieValue);
				
				var decodedStr = JsonWebToken.Decode(loggedObj.encodedToken, GloobsterConfig.AppSecret, true);

				var tokenObj = Newtonsoft.Json.JsonConvert.DeserializeObject<AuthorizationToken>(decodedStr);

				return tokenObj;
			}
			catch
			{
				return null;
			}
		}

		public ObjectId DBUserId => new ObjectId(UserId);

		public bool IsUserLogged => !string.IsNullOrEmpty(UserId);

		public PortalBaseController(IDbOperations db)
        {
            DB = db;
        }


        public IDbOperations DB;
    }
}