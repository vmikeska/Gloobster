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
        public ITripPermissionsDomain Perms { get; set; }

        public TripParticipantsController(ITripPermissionsDomain perms, ITripInviteDomain tripInviteDom, ILogger log, IDbOperations db) : base(log, db)
		{
			InviteDomain = tripInviteDom;
            Perms = perms;
		}

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(string tripId, string id)
        {
            Perms.HasEditPermissions(tripId, UserId, true);

            await InviteDomain.RemoveParticipant(tripId, id);

            return new ObjectResult(null);
        }

        [HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody]InviteRequest request)
		{
            Perms.HasEditPermissions(request.tripId, UserId, true);

            InviteDomain.InvitePaticipants(request.users, UserId, request.tripId);

            return new ObjectResult(null);
		}

		

	}



}