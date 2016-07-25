using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities.Trip;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
    public class RequestTripInvitationController : BaseApiController
    {
        public INotifications NotTexts;
        public INotificationsDomain NotDomain;

        public RequestTripInvitationController(INotificationsDomain notDomain, INotifications notTexts, ILogger log, IDbOperations db) : base(log, db)
        {
            NotTexts = notTexts;
            NotDomain = notDomain;
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] InvitRequest req)
        {
            var tidObj = new ObjectId(req.tid);
            var trip = DB.FOD<TripEntity>(t => t.id == tidObj);

            var txt = NotTexts.TripRequestToJoinNotification(req.tid, UserId, trip.User_id.ToString());
            NotDomain.AddNotification(txt);
            
            return new ObjectResult(true);
        }

    }

    public class InvitRequest
    {
        public string tid { get; set; }        
    }
}