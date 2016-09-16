using System;
using System.Collections.Generic;
using System.Linq;
using Autofac;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Langs;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.ViewModels;
using Gloobster.ReqRes;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Net.Http.Headers;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Base
{
    public class PortalBaseController: Controller
    {
		public IDbOperations DB { get; set; }
        public ILogger Log { get; set; }
        public IComponentContext CC { get; set; }
        public ILanguages Langs { get; set; }

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

        private string _userId;
        public string UserId {
            get
            {
                if (string.IsNullOrEmpty(_userId))
                {
                    var utils = new TokenUtils();

                    var token = utils.ReadToken(Request.HttpContext);
                    _userId = token?.UserId;                    
                }

                return _userId;
            }

            set { _userId = value; }
        }
        
        public bool IsUserLogged => !string.IsNullOrEmpty(UserId);
        
        private UserEntity _user;
        public new UserEntity User
        {
            get
            {                
                if (!IsUserLogged)
                {
                    return null;
                }

                if (_user != null)
                {
                    return _user;
                }

                _user = DB.FOD<UserEntity>(u => u.User_id == UserIdObj);
                
                return _user;
            }
        }

        private AccountEntity _account;
        public AccountEntity Account
        {
            get
            {
                if (!IsUserLogged)
                {
                    return null;
                }

                if (_account == null)
                {
                    _account = DB.FOD<AccountEntity>(u => u.User_id == UserIdObj);
                }
                
                return _account;
            }
        }

        public PortalBaseController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs)
        {
            DB = db;
            Log = log;
            CC = cc;
            Langs = langs;
        }

        public T CreateViewModelInstance<T>() where T : ViewModelBase, new()
        {
            string ua = HttpContext.Request.Headers["User-Agent"];
            if (!string.IsNullOrEmpty(ua))
            {
                Langs.InitLangs();
            }

            var locale = "en";
            var headers = Request.GetTypedHeaders();
            List<StringWithQualityHeaderValue> langs = null;
            if (headers.AcceptLanguage != null)
            {
                langs = headers.AcceptLanguage.ToList();
            }

            if (langs != null && langs.Any())
            {
                var lang = langs.First();
                locale = lang.Value;
            }

            var instance = new T
            {
                User = User,
                DB = DB,
                SocialNetworks = new List<SocialNetworkType>(),
                NotificationCount = 0,
                UserId = UserId,
                CanManageArticleAdmins = false,
                HasAnyWikiPermissions = false,
                Langs = (Languages)Langs,
                Lang = "en", // todo: change from session,
                Locale = locale,
                HasUserAgent = !string.IsNullOrEmpty(ua),
                IsDemo = false
            };

            var hasCookie = Request.Cookies.ContainsKey("Demo");
            if (hasCookie)
            {
                instance.IsDemo = Request.Cookies["Demo"].ToString() == "on";
            }
            
            if (IsUserLogged)
            {
                var notifications = DB.FOD<NotificationsEntity>(n => n.User_id == UserIdObj.Value);
                if (notifications != null)
                {
                    instance.NotificationCount = notifications.Notifications.Count(n => n.Status == NotificationStatus.Created);
                }
                
                var permissions = CC.Resolve<IWikiPermissions>();
                instance.HasAnyWikiPermissions = permissions.IsAdminOfSomething(UserId);
                instance.CanManageArticleAdmins = permissions.IsSuperOrMasterAdmin(UserId);

                instance.SocialNetworks = Networks;

                if (Networks.Contains(SocialNetworkType.Facebook))
                {
                    var fbNet = SocNetworks.FirstOrDefault(a => a.NetworkType == SocialNetworkType.Facebook);
                    instance.FbToken = fbNet.AccessToken;
                }
            }
            
            return instance;
        }

        private List<SocialAccountEntity> _socNetworks;
        public List<SocialAccountEntity> SocNetworks
        {
            get
            {
                if (_socNetworks == null)
                {
                    _socNetworks = DB.List<SocialAccountEntity>(a => a.User_id == UserIdObj);                    
                }

                return _socNetworks;
            }
        }

        private List<SocialNetworkType> _networks;
        public List<SocialNetworkType> Networks
        {
            get
            {
                if (_networks == null)
                {                    
                    _networks = SocNetworks.Select(n => n.NetworkType).ToList();

                    if (!string.IsNullOrEmpty(Account.Mail))
                    {
                        _networks.Add(SocialNetworkType.Base);
                    }
                }

                return _networks;
            }
        }

        public SocialAccountEntity GetSocNet(SocialNetworkType socNet)
        {
            return SocNetworks.FirstOrDefault(n => n.NetworkType == socNet);
        }

        public bool HasSocNet(SocialNetworkType socNet)
        {
            return Networks.Contains(socNet);
        }


        
    }
}