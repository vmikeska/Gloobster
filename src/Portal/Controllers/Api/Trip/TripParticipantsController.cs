using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
    public class TripParticipantsController : BaseApiController
	{
		public ITripInviteDomain InviteDomain { get; set; }

		public TripParticipantsController(ITripInviteDomain tripInviteDom, ILogger log, IDbOperations db) : base(log, db)
		{
			InviteDomain = tripInviteDom;
		}

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(string tripId, string id)
        {
            //todo: check rights for this tripId

            await InviteDomain.RemoveParticipant(tripId, id);

            return new ObjectResult(null);
        }

        [HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]InviteRequest request)
		{
			
			//todo: check rights for this tripId
            
			InviteDomain.InvitePaticipants(request.users, UserId, request.tripId);

            return new ObjectResult(null);
		}

		

	}



}