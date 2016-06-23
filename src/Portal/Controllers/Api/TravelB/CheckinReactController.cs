using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using System.Linq;
using Gloobster.Entities.TravelB;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class CheckinReactQueryRequest
    {
        public string checkinId { get; set; }

        public CheckinReactionState state { get; set; }
    }


    public class CheckinReactController : BaseApiController
    {
        public CheckinReactController(ILogger log, IDbOperations db) : base(log, db)
        {
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(CheckinReactQueryRequest req)
        {
            if (!string.IsNullOrEmpty(req.checkinId))
            {
                var cidObj = new ObjectId(req.checkinId);

                var item = DB.FOD<CheckinReactionEntity>(r => r.Checkin_id == cidObj);

                var uids1 = new List<ObjectId> {item.AskingUser_id, item.TargetUser_id};                
                var users1 = DB.List<UserEntity>(u => uids1.Contains(u.User_id));

                var askingUser1 = users1.FirstOrDefault(u => u.User_id == item.AskingUser_id);
                var targetUser1 = users1.FirstOrDefault(u => u.User_id == item.TargetUser_id);

                var res = Convert(item, askingUser1, targetUser1);

                return new ObjectResult(res);
            }
            
            var items = DB.List<CheckinReactionEntity>(r => 
                (r.TargetUser_id == UserIdObj || r.AskingUser_id == UserIdObj) &&
                r.State == req.state);

            var uids = items.Select(u => u.AskingUser_id).ToList();
            uids.AddRange(items.Select(u => u.TargetUser_id));
            uids = uids.Distinct().ToList();
            var users = DB.List<UserEntity>(u => uids.Contains(u.User_id));

            var ic = items.Select(i =>
            {
                var askingUser = users.FirstOrDefault(u => u.User_id == i.AskingUser_id);
                var targetUser = users.FirstOrDefault(u => u.User_id == i.TargetUser_id);
                return Convert(i, askingUser, targetUser);
            }).ToList();

            return new ObjectResult(ic);            
        }

        private CheckinReactionResponse Convert(CheckinReactionEntity e, UserEntity askingUser, UserEntity targetUser)
        {
            var r = new CheckinReactionResponse
            {
                reactId = e.id.ToString(),
                state = e.State,
                askingUserId = e.AskingUser_id.ToString(),
                askingUserName = BuildUserName(askingUser),
                targetUserId = e.TargetUser_id.ToString(),
                targetUserName = BuildUserName(targetUser),
                checkinId = e.Checkin_id.ToString(),
                chatPosts = e.ChatPosts.Select(p => new ChatPostResponse
                {
                    userId = p.User_id.ToString(),
                     id = p.id.ToString(),
                     text = p.Text,
                     time = p.Time
                }).ToList()
            };
            return r;
        }

        private string BuildUserName(UserEntity u)
        {
            return $"{u.FirstName} {u.LastName} ({u.DisplayName})";
        }

        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] CheckinReactionPutRequest req)
        {
            //todo: check rights

            var checkinIdObj = new ObjectId(req.id);

            var f = DB.F<CheckinReactionEntity>().Eq(r => r.Checkin_id, checkinIdObj);
            var u = DB.U<CheckinReactionEntity>().Set(c => c.State, req.state);
            var res = await DB.UpdateAsync(f, u);

            return new ObjectResult(null);
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] CheckinReactRequest req)
        {
            var targetUserIdObj = new ObjectId(req.uid);
            var checkinIdObj = new ObjectId(req.cid);

            var entityExisting = DB.FOD<CheckinReactionEntity>(r =>
                r.AskingUser_id == UserIdObj &&
                r.TargetUser_id == targetUserIdObj &&
                r.Checkin_id == checkinIdObj);

            if (entityExisting != null)
            {
                return new ObjectResult(null);
            }

            var react = new CheckinReactionEntity
            {
                id = ObjectId.GenerateNewId(),
                State = CheckinReactionState.Created,
                TargetUser_id = targetUserIdObj,
                Checkin_id = checkinIdObj,
                AskingUser_id = UserIdObj,
                ChatPosts = new List<ChatPostSE>()
            };
            await DB.SaveAsync(react);
            
            return new ObjectResult(react.id.ToString());
        }
    }

    public class CheckinReactionPutRequest
    {
        public string id { get; set; }
        public CheckinReactionState state { get; set; }
    }

    public class CheckinReactRequest
    {
        public string uid { get; set; }
        public string cid { get; set; }
    }

    public class CheckinReactionResponse
    {
        public string reactId { get; set; }
        public string askingUserId { get; set; }
        public string askingUserName { get; set; }
        public string targetUserId { get; set; }
        public string targetUserName { get; set; }
        public string checkinId { get; set; }
        public CheckinReactionState state { get; set; }

        public List<ChatPostResponse> chatPosts { get; set; }
    }

    public class ChatPostResponse
    {
        public string id { get; set; }
        public string userId { get; set; }
        public string text { get; set; }
        public DateTime time { get; set; }
    }


    

    
}