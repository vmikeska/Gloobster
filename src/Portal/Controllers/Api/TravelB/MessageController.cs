using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities.TravelB;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using System.Linq;
using Gloobster.Entities;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class MessageController : BaseApiController
    {
        public MessageController(ILogger log, IDbOperations db) : base(log, db)
        {
            
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(GetMsgsRequest req)
        {
            var toUserId = new ObjectId(req.userId);
            var resp = GetMessages(toUserId);

            MarkAllMessagesAsRead(UserIdObj, toUserId);

            return new ObjectResult(resp);
        }
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] MessageRequest req)
        {
            //todo: check if not blocked
            var toUserId = new ObjectId(req.userId);
            
            var msg = DB.FOD<MessageEntity>(e => e.UserIds.Contains(UserIdObj) && e.UserIds.Contains(toUserId));
            if (msg == null)
            {
                msg = new MessageEntity
                {
                    id = ObjectId.GenerateNewId(),
                    UserIds = new List<ObjectId> {UserIdObj, toUserId},
                    Messages = new List<MessageSE>()
                };
                await DB.SaveAsync(msg);
            }

            var newMsg = new MessageSE
            {
                id = ObjectId.GenerateNewId(),
                User_id = UserIdObj,
                Message = req.message,
                Date = DateTime.UtcNow,
                Read = false
            };

            var f = DB.F<MessageEntity>().Eq(m => m.id, msg.id);
            var u = DB.U<MessageEntity>().Push(m => m.Messages, newMsg);
            var res = await DB.UpdateAsync(f, u);

            var resp = GetMessages(toUserId);

            return new ObjectResult(resp);
        }

        private MessagesResponse GetMessages(ObjectId uidObj)
        {
            var msg = DB.FOD<MessageEntity>(e => e.UserIds.Contains(UserIdObj) && e.UserIds.Contains(uidObj));

            var userIds = new List<ObjectId> {UserIdObj, uidObj};
            var users = DB.List<UserEntity>(u => userIds.Contains(u.User_id));

            var resp = new MessagesResponse
            {
                messages = new List<MessageResponse>()
            };

            if (msg == null)
            {
                return resp;
            }

            foreach (var m in msg.Messages)
            {
                var user = users.FirstOrDefault(u => u.User_id == m.User_id);

                var mr = new MessageResponse
                {
                    userId = m.User_id.ToString(),
                    name = user.DisplayName,
                    message = m.Message,
                    date = m.Date,
                    read = m.Read
                };
                resp.messages.Add(mr);
            }

            msg.Messages = msg.Messages.OrderByDescending(o => o.Date).ToList();
            
            return resp;
        }

        private async void MarkAllMessagesAsRead(ObjectId readingUser, ObjectId otherUser)
        {
            //cannot be updated everything at once
            //https://jira.mongodb.org/browse/SERVER-1243

            var msgCont = DB.FOD<MessageEntity>(e => e.UserIds.Contains(readingUser) && e.UserIds.Contains(otherUser));

            var messages = msgCont.Messages.Where(a => a.User_id != readingUser).OrderByDescending(a => a.Date);

            var update = DB.U<MessageEntity>().Set("Messages.$.Read", true);

            foreach (var m in messages)
            {
                if (m.Read)
                {
                    break;
                }
                
                var filter = DB.F<MessageEntity>().Eq(p => p.id, msgCont.id) & DB.F<MessageEntity>().Eq("Messages._id", m.id);                
                var res = await DB.UpdateManyAsync(filter, update);
            }            
        }


    }
    
    public class GetMsgsRequest
    {
        public string userId { get; set; }
    }

    public class MessageRequest
    {
        public string userId { get; set; }
        public string message { get; set; }
    }

    public class MessageResponse
    {
        public string message { get; set; }
        public DateTime date { get; set; }
        public string dateFormatted { get; set; }
        public string userId { get; set; }
        public string name { get; set; }
        public bool read { get; set; }
    }

    public class MessagesResponse
    {
        public List<MessageResponse> messages { get; set; }
    }

}