using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Notifications;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;

namespace Gloobster.Portal.Controllers.Api.Notification
{
    [Route("api/[controller]")]
    public class NotificationController : BaseApiController
    {
        public INotificationsDomain Notifications { get; set; }

        public NotificationController(INotificationsDomain notifications, ILogger log, IDbOperations db) : base(log, db)
        {
            Notifications = notifications;
        }
		
        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(NotificationDeleteRequest req)
        {
            if (req.deleteAll.HasValue && req.deleteAll.Value)
            {
                await Notifications.DeleteAllNotifications(UserId);
            }
            else
            {
                await Notifications.DeleteNotification(UserId, req.id);
            }

            var notif = DB.C<NotificationsEntity>().FirstOrDefault(p => p.PortalUser_id == UserIdObj);

            return new ObjectResult(notif.Notifications.Count);
        }
		
    }
}