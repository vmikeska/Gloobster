using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripSocNetworksController : BaseApiController
	{
		public ITripShareDomain ShareDomain { get; set; }

		public TripSocNetworksController(ITripShareDomain shareDomain, IDbOperations db) : base(db)
		{			
			ShareDomain = shareDomain;
		}

		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody]ShareRequest req)
		{
			//todo: check rights for this tripId

			var share = new ShareTripDO
			{
				TripId = req.tripId,
				Message = req.message,
				Networks = req.networks,
				AllowRequestJoin = req.allowRequestJoin,
				UserId = UserId
			};

			ShareDomain.ShareTrip(share);

			return new ObjectResult(null);
		}

	}	
}