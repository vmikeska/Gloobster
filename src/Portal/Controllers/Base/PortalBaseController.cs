using System.Linq;
using Gloobster.Common;
using Gloobster.Common.CommonEnums;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModels;
using Gloobster.Portal.ReqRes;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Base
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

	    private PortalUserEntity _portalUser;
		public PortalUserEntity PortalUser
	    {
		    get
		    {
			    if (!IsUserLogged)
			    {
				    return null;
			    }

			    if (_portalUser != null)
			    {
				    return _portalUser;
			    }

			    _portalUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == DBUserId);

			    if (_portalUser == null)
			    {
				    //throw
			    }

			    return _portalUser;
		    }    
	    }

	    public string GetSocNetworkStr()
	    {
		    var socNetwork = PortalUser.SocialAccounts?.FirstOrDefault();
		    if (socNetwork == null)
		    {
			    return string.Empty;
		    }

		    switch (socNetwork.NetworkType)
		    {
			    case SocialNetworkType.Facebook:
				    return "F";
			    case SocialNetworkType.Twitter:
				    return "T";
			    case SocialNetworkType.Google:
				    return "G";
			    case SocialNetworkType.Base:
				    return "B";
		    }

		    return string.Empty;
	    }

	    public PortalBaseController(IDbOperations db)
        {
            DB = db;
        }

	    public T CreateViewModelInstance<T>() where T : ViewModelBase, new()
	    {
		    var instance = new T
		    {
			    PortalUser = PortalUser,
				DB = DB,
				SocialNetwork = GetSocNetworkStr()
			};
		    return instance;
	    }


        public IDbOperations DB;
    }
}