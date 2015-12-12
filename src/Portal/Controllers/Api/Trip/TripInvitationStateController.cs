using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripInvitationStateController : BaseApiController
	{
		public ITripInviteDomain InviteDomain { get; set; }

		public TripInvitationStateController(ITripInviteDomain inviteDomain, IDbOperations db) : base(db)
		{
			InviteDomain = inviteDomain;
		}

		[HttpPut]
		[Authorize]
		public async Task<IActionResult> Put([FromBody]ChangeInvitationStateRequest req)
		{
			//todo: check rights for this tripId
			
			bool updated = await InviteDomain.UpdateInvitationState(req.tripId, UserId, req.newState);

			return new ObjectResult(updated);
		}


		
	}
}