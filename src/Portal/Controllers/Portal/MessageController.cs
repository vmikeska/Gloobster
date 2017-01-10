using System.Collections.Generic;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.TravelB;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using System.Linq;


namespace Gloobster.Portal.Controllers.Portal
{
    public class MessageController : PortalBaseController
    {
        public MessageController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {

        }
        
        [AuthorizeWeb]
        public IActionResult Home()
        {
            var msgs = DB.List<MessageEntity>(e => e.UserIds.Contains(UserIdObj.Value));

            var allUserIds = msgs.SelectMany(i => i.UserIds).Where(a => a != UserIdObj.Value).Distinct();
            var allUsers = DB.List<UserEntity>(u => allUserIds.Contains(u.User_id));

            var messages = new List<UserMessage>();

            foreach (var msg in msgs)
            {
                var lastMessage = msg.Messages.OrderByDescending(m => m.Date).First();

                var otherUserId = msg.UserIds.FirstOrDefault(i => i != UserIdObj.Value);
                var otherUser = allUsers.FirstOrDefault(u => u.User_id == otherUserId);

                var message = new UserMessage
                {
                    UserId = otherUserId.ToString(),
                    Date = lastMessage.Date,
                    UserDisplayName = otherUser.DisplayName,
                    UserFirstName = otherUser.FirstName,
                    UserLastName = otherUser.LastName,
                    LastMessageText = lastMessage.Message,
                    Unread = !lastMessage.Read && (lastMessage.User_id != UserIdObj.Value)
                };
                messages.Add(message);
            }
             
            var vm = CreateViewModelInstance<MessagesViewModel>();
            vm.DefaultLangModuleName = "pageMessages";
            vm.UserMessages = messages.OrderByDescending(m => m.Date).ToList();

            return View(vm);
        }

        [AuthorizeWeb]
        public IActionResult Message(string id)
        {
            var userIdObj = new ObjectId(id);

            var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);

            var vm = CreateViewModelInstance<MessageViewModel>();
            vm.OtherUserId = id;
            vm.OtherUserDisplayName = user.DisplayName;
            vm.OtherUserFirstName = user.FirstName;
            vm.OtherUserLastName = user.LastName;

            return View(vm);
        }

        

    }
}