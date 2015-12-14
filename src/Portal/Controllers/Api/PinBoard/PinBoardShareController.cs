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

namespace Gloobster.Portal.Controllers.Api.PinBoard
{	
	[Route("api/[controller]")]
	public class PinBoardShareController : BaseApiController
	{
		public IShareMapDomain ShareDomain { get; set; }

		public PinBoardShareController(IShareMapDomain shareDomain, IDbOperations db) : base(db)
		{
			ShareDomain = shareDomain;
		}
		
		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody]MapShareRequest req)
		{
			//todo: check rights for this share

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