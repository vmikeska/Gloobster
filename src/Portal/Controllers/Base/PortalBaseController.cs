using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainModels;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.ViewModels;
using Gloobster.ReqRes;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Base
{
    public class PortalBaseController: Controller
    {
		public IDbOperations DB { get; set; }
        public ILogger Log { get; set; }

        public ObjectId? UserIdObj
        {
            get
            {
                if (string.IsNullOrEmpty(UserId))
                {
                    return null;
                }
                return new ObjectId(UserId);
            }
        }
            
        public bool IsUserLogged => !string.IsNullOrEmpty(UserId);

        private string _userId;
		public string UserId
		{
			get
			{
				if (!string.IsNullOrEmpty(_userId))
				{
					return _userId;
				}

				string userId = Request.HttpContext.Session.GetString(PortalConstants.UserSessionId);
				if (!string.IsNullOrEmpty(userId))
				{
					return userId;
				}

				var authToken = GetAuthorizationTokenFromCookie();
				if (authToken == null)
				{
					return string.Empty;
				}

                Request.HttpContext.Session.SetString(PortalConstants.UserSessionId, authToken.UserId);
				_userId = authToken.UserId;
				
				return _userId;
			}
		}

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

                _portalUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == UserIdObj);

                if (_portalUser == null)
                {
                    //throw
                }

                return _portalUser;
            }
        }
        
        public PortalBaseController(ILogger log, IDbOperations db)
        {
            DB = db;
            Log = log;
        }

        public T CreateViewModelInstance<T>() where T : ViewModelBase, new()
        {
            int notifsCount = 0;
            string socNetStr = "";

            if (IsUserLogged)
            {
                var notifications = DB.C<NotificationsEntity>().FirstOrDefault(n => n.PortalUser_id == UserIdObj.Value);
                if (notifications != null)
                {
                    notifsCount = notifications.Notifications.Count(n => n.Status == NotificationStatus.Created);
                }

                socNetStr = GetSocNetworkStr();
                HttpContext.Response.Cookies.Append(PortalConstants.NetworkTypes, socNetStr);
            }

            var instance = new T
            {
                PortalUser = PortalUser,
                DB = DB,
                SocialNetwork = socNetStr,
                NotificationCount = notifsCount,
                UserId = UserId
            };
            return instance;
        }
        
        private AuthorizationToken GetAuthorizationTokenFromCookie()
	    {
			string cookieValue = Request.HttpContext.Request.Cookies[PortalConstants.LoginCookieName];

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
        
	    private string GetSocNetworkStr()
	    {
	        var networks = new List<string>();
            if (PortalUser.SocialAccounts != null && PortalUser.SocialAccounts.Any())
	        {
	            foreach (var account in PortalUser.SocialAccounts)
	            {
	                if (account.NetworkType == SocialNetworkType.Facebook)
	                {
	                    networks.Add("F");
	                }

	                if (account.NetworkType == SocialNetworkType.Twitter)
	                {
	                    networks.Add("T");
	                }

	                if (account.NetworkType == SocialNetworkType.Google)
	                {
	                    networks.Add("G");
	                }
	            }
	        }
	        else
	        {
                networks.Add("B");                
	        }
            
            var netStr = string.Join(",", networks);            
            return netStr;
	    }        
    }
}