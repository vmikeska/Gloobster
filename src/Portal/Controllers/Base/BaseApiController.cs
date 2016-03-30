using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;
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
                //if (string.IsNullOrEmpty(UserId))
                //{
                //    return null;
                //}
                return new ObjectId(UserId);
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