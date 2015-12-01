using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.Portal.Controllers.Base
{
	[Route("api/[controller]")]
	public class BaseApiController: Controller
	{
		public IDbOperations DB { get; set; }

		public BaseApiController(IDbOperations db)
		{
			DB = db;
		}

		public string UserId { get; set; }

		public ObjectId UserIdObj => new ObjectId(UserId);

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

				_portalUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == UserIdObj);

				if (_portalUser == null)
				{
					//throw
				}

				return _portalUser;
			}
		}
	}
}