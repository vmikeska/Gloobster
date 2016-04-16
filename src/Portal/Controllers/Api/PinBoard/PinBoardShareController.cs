using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.PinBoard;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{	
	[Route("api/[controller]")]
	public class PinBoardShareController : BaseApiController
	{
		public IShareMapDomain ShareDomain { get; set; }

		public PinBoardShareController(IShareMapDomain shareDomain, ILogger log, IDbOperations db) : base(log, db)
		{
			ShareDomain = shareDomain;
		}
		
		[HttpPost]
		[AuthorizeApi]
		public IActionResult Post([FromBody]MapShareRequest req)
		{			
			var share = new ShareMapDO
			{				
				Message = req.message,
				Networks = req.networks,				
				UserId = UserId
			};

			ShareDomain.ShareCities(share);

			return new ObjectResult(null);
		}
		
	}	
}