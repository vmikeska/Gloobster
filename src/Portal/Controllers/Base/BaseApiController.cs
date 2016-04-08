using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;
using Gloobster.DomainModels.Services.Facebook.FriendsExtractor;
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

		private UserEntity _portalUser;
		public UserEntity PortalUser
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

				_portalUser = DB.C<UserEntity>().FirstOrDefault(u => u.id == UserIdObj);

				if (_portalUser == null)
				{
					//throw
				}

				return _portalUser;
			}
		}
	}
}