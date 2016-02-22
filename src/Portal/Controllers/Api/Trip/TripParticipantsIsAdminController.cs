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

        public TripParticipantsIsAdminController(ITripInviteDomain tripInviteDom, ILogger log, IDbOperations db) : base(log, db)
        {
            InviteDomain = tripInviteDom;
        }

        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody]IsAdminRequest request)
        {
            //todo: check rights for this tripId

            await InviteDomain.UpdateParticipantAdmin(request.tripId, request.id, request.isAdmin);

            return new ObjectResult(null);
        }
    }
}