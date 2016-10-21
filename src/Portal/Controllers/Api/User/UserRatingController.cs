using System;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.User
{
	public class UserRatingController: BaseApiController
	{
		
		
		public UserRatingController(ILogger log, IDbOperations db) : base(log, db)
		{
			
		}

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(UserRatingGetRequest req)
        {
           //User.Ratings

            return new ObjectResult(null);
        }

        [AuthorizeApi]
        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            var ridObj = new ObjectId(id);

            var filter = DB.F<UserEntity>().Eq(f => f.User_id, UserIdObj);
            var update = DB.PF<UserEntity, UserRatingSE>(t => t.Ratings, c => c.id == ridObj);
            var result = await DB.UpdateAsync(filter, update);
            
            return new ObjectResult(null);
        }

        [HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody] UserRatingPostRequest req)
        {
            var targetUserId = new ObjectId(req.targetUserId);
            
            var ur = new UserRatingSE
            {
                id = ObjectId.GenerateNewId(),
                User_id = UserIdObj,
                Text = req.text,
                Inserted = DateTime.UtcNow
            };
            
            var filter = DB.F<UserEntity>().Eq(f => f.User_id, targetUserId);
            var update = DB.U<UserEntity>().Push(f => f.Ratings, ur);
            var result = await DB.UpdateAsync(filter, update);

            var res = new UserRatingPostResponse
            {
                userId = UserId,
                id = ur.id.ToString(),
                text = req.text,
                name = $"{User.FirstName} {User.LastName}"
            };

            return new ObjectResult(res);
		}

		

	}


    public class UserRatingPostResponse
    {
        public string id { get; set; }
        public string userId { get; set; }
        public string name { get; set; }
        public string text { get; set; }        
    }
    

    public class UserRatingGetRequest
    {
        public string id { get; set; }
    }

    public class UserRatingPostRequest
    {
        public string text { get; set; }
        public string targetUserId { get; set; }
    }
}