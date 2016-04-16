using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
    public class TripParticipantsIsAdminController : BaseApiController
    {
        public ITripInviteDomain InviteDomain { get; set; }
        public ITripPermissionsDomain Perms { get; set; }

        public TripParticipantsIsAdminController(ITripPermissionsDomain perms, ITripInviteDomain tripInviteDom, ILogger log, IDbOperations db) : base(log, db)
        {
            InviteDomain = tripInviteDom;
            Perms = perms;
        }

        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody]IsAdminRequest request)
        {
            Perms.HasEditPermissions(request.tripId, UserId, true);

            await InviteDomain.UpdateParticipantAdmin(request.tripId, request.id, request.isAdmin);

            return new ObjectResult(null);
        }
    }
}