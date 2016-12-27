using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.TravelB
{
    public class UserPropsController : BaseApiController
    {
        
        public UserPropsController(ILogger log, IDbOperations db) : base(log, db)
        {
            
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get()
        {
            var user = DB.FOD<UserEntity>(u => u.User_id == UserIdObj);

            var ur = new UserResponse
            {
                userId = user.User_id.ToString(),
                hasProfileImage = user.HasProfileImage,
                birthYear = user.BirthYear,
                gender = (int)user.Gender,
                firstName = user.FirstName,
                lastName = user.LastName,
                languages = user.Languages,
            };

            if (user.CurrentLocation != null)
            {
                ur.currentLocation = user.CurrentLocation.City;
            }

            if (user.HomeLocation != null)
            {
                ur.homeLocation = user.HomeLocation.City;
            }

            return new ObjectResult(ur);
        }

        public class UserResponse
        {
            public string userId { get; set; }
            
            public string firstName { get; set; }
            public string lastName { get; set; }
            public bool hasProfileImage { get; set; }

            public string homeLocation { get; set; }
            public string currentLocation { get; set; }
            
            public List<string> languages { get; set; }
            
            public int gender { get; set; }
            public int? birthYear { get; set; }            
        }
        


    }
}