using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;
using Gloobster.DomainModels.Services.Facebook.FriendsExtractor;
using Gloobster.Enums;
using Serilog;

namespace Gloobster.Portal.Controllers.Base
{
	[Route("api/[controller]")]    
	public class BaseApiController: Controller
	{
		public IDbOperations DB { get; set; }
        public ILogger Log { get; set; }
        
        public BaseApiController(ILogger log, IDbOperations db)
		{
			DB = db;
            Log = log;
		}

		public string UserId { get; set; }

        public ObjectId UserIdObj
        {
            get
            {                
                return new ObjectId(UserId);
            }
        }

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

        private bool? _isConfirmedRegistration;
        public bool IsConfirmedRegistration
	    {
            get
	        {

	            if (!_isConfirmedRegistration.HasValue)
	            {
	                var account = DB.FOD<AccountEntity>(a => a.User_id == UserIdObj);
	                if (account != null && account.EmailConfirmed)
	                {
	                    _isConfirmedRegistration = true;
	                    return true;
	                }

	                var accountDomain = new AccountDomain {DB = DB};
	                var socAccounts = accountDomain.GetAuths(UserId);
	                if (socAccounts.Any())
	                {
	                    _isConfirmedRegistration = true;
	                    return true;
	                }

	                _isConfirmedRegistration = false;
	            }

	            return _isConfirmedRegistration.Value;
	        }
	    }

        public bool IsUserLogged => !string.IsNullOrEmpty(UserId);

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