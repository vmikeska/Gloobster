using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities.TravelB;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class ReactChatController : BaseApiController
    {
        public ReactChatController(ILogger log, IDbOperations db) : base(log, db)
        {

        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(ChatGetRequest req)
        {
            var lastDate = TimeZoneInfo.ConvertTimeToUtc(req.lastDate);
            
            if (req.reactIds != null && req.reactIds.Any())
            {
                var wraps = new List<ChatPostsWrapperResponse>();
                foreach (var reactId in req.reactIds)
                {
                    var ridObj = new ObjectId(reactId);

                    var newPosts = GetNewPosts(ridObj, lastDate);

                    var wrap = new ChatPostsWrapperResponse
                    {
                        reactId = reactId,
                        posts = newPosts
                    };
                    wraps.Add(wrap);
                }
                return new ObjectResult(wraps);
            }

            return new ObjectResult(null);            
        }

        private List<ChatPostResponse> GetNewPosts(ObjectId ridObj, DateTime lastDate)
        {            
            var reaction = DB.FOD<CheckinReactionEntity>(e => e.id == ridObj);

            var newPosts = reaction.ChatPosts.Where(p => p.Time > lastDate).ToList();
            var res = newPosts.Select(p => new ChatPostResponse
            {
                time = p.Time,
                userId = p.User_id.ToString(),
                id = p.id.ToString(),
                text = p.Text
            }).ToList();
            return res;
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] ChatPostRequest req)
        {
            var ridObj = new ObjectId(req.reactId);

            var post = new ChatPostSE
            {
                id = ObjectId.GenerateNewId(),
                User_id = UserIdObj,
                Text = req.text,
                Time = DateTime.UtcNow
            };

            var f = DB.F<CheckinReactionEntity>().Eq(r => r.id, ridObj);
            var u = DB.U<CheckinReactionEntity>().Push(c => c.ChatPosts, post);
            var res = await DB.UpdateAsync(f, u);

            var ld = DateTime.MinValue;
            if (req.lastDate.HasValue)
            {
                ld = req.lastDate.Value;
            }

            var newPosts = GetNewPosts(ridObj, ld);

            return new ObjectResult(newPosts);
        }        
    }

    public class ChatPostsWrapperResponse
    {
        public List<ChatPostResponse> posts { get; set; }
        public string reactId { get; set; }
    }

    public class ChatGetRequest
    {
        public List<string> reactIds { get; set; }
        public DateTime lastDate { get; set; }
    }

    public class ChatPostRequest
    {
        public string reactId { get; set; }
        public string userId { get; set; }
        public string text { get; set; }
        public DateTime? lastDate { get; set; }
    }
}