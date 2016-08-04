using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;
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
		    var errorCode = Validate(req.tripId);

		    bool isValid = string.IsNullOrEmpty(errorCode);
		    if (!isValid)
		    {
                return new ObjectResult(errorCode);
            }
            
            var share = new ShareTripDO
			{
				TripId = req.tripId,
				Message = req.message,
				Networks = req.networks,
				UserId = UserId
			};

			ShareDomain.ShareTrip(share);

			return new ObjectResult(string.Empty);
		}

        private string Validate(string tripId)
        {
            var tripIdObj = new ObjectId(tripId);
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

            bool hasAnyUnnamed = trip.Places.Any(p => p.Place == null);
            if (hasAnyUnnamed)
            {
                return "HasUnnamed";
            }

            return string.Empty;
        }

	}
    
}