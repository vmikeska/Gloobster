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
	public class TripParticipantsController : BaseApiController
	{
		public ITripInviteDomain InviteDomain { get; set; }

		public TripParticipantsController(ITripInviteDomain tripInviteDom, IDbOperations db) : base(db)
		{
			InviteDomain = tripInviteDom;
		}

	
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]InviteRequest request)
		{
			
			//todo: check rights for this tripId

			var participants = request.users.Select(u => u.ToDO()).ToList();
			InviteDomain.InvitePaticipants(participants, UserId, request.tripId);
			
			return new ObjectResult(null);
		}

		

	}



}