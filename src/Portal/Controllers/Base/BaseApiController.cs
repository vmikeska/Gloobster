using Gloobster.Common;
using Gloobster.Database;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

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
	}
}