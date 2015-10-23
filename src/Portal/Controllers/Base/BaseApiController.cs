using Gloobster.Common;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class BaseApiController: Controller
	{
		public IDbOperations DB { get; set; }

		public BaseApiController(IDbOperations db)
		{
			DB = db;
		}
		
	}
}