using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
    public class TripSocNetworksController : BaseApiController
	{
		public ITripShareDomain ShareDomain { get; set; }
        
        public TripSocNetworksController(ITripShareDomain shareDomain, ILogger log, IDbOperations db) : base(log, db)
		{			
			ShareDomain = shareDomain;
		}

		[HttpPost]
		[AuthorizeApi]
		public IActionResult Post([FromBody]ShareRequest req)
		{			
			var share = new ShareTripDO
			{
				TripId = req.tripId,
				Message = req.message,
				Networks = req.networks,
				UserId = UserId
			};

			ShareDomain.ShareTrip(share);

			return new ObjectResult(null);
		}

	}	
}