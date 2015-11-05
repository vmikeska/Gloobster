using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripShareController : BaseApiController
	{
		public ITripShareDomain ShareDomain { get; set; }

		public TripShareController(IDbOperations db) : base(db)
		{

		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]ShareRequest request)
		{
			
			//todo: check rights for this tripId

			var participants = request.users.Select(u => u.ToDO()).ToList();
			ShareDomain.InvitePaticipants(participants, request.tripId);
			
			return new ObjectResult(null);
		}

		

	}
}