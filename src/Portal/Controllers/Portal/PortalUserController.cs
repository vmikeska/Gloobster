using Gloobster.Common;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Portal
{
	public class PortalUserController : PortalBaseController
	{
		
		public PortalUserController(IDbOperations db) : base(db)
		{
		
		}
		
		public IActionResult Detail()
		{
			return View();
		}

		public IActionResult Settings()
		{
			return View();
		}
	
	}
	
}
