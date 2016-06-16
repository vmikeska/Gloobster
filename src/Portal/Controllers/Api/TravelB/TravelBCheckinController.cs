using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Globalization;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.TravelB;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using System.Linq;
using Gloobster.DomainModels.TravelB;
using Gloobster.DomainObjects.TravelB;
using Gloobster.Entities;
using Gloobster.Mappers;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class CheckinCityController : BaseApiController
    {
        public CheckinCityDomain TbDomain { get; set; }

        public CheckinCityController(ILogger log, IDbOperations db) : base(log, db)
        {
            TbDomain = new CheckinCityDomain
            {
                DB = db
            };
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(CheckinQueryRequest req)
        {
            if (!string.IsNullOrEmpty(req.id))
            {
                var userIdObj = new ObjectId(req.id);
                var checkin = DB.FOD<CheckinCityEntity>(u => u.User_id == userIdObj);

                if (checkin == null)
                {
                    return new ObjectResult(null);
                }

                var checkinDO = checkin.ToDO();
                var user = DB.FOD<UserEntity>(u => u.User_id == UserIdObj);
                var response = ConvertCheckin(user, checkinDO);
                return new ObjectResult(response);
            }
            else if (req.me)
            {
                var checkin = DB.FOD<CheckinCityEntity>(u => u.User_id == UserIdObj);

                if (checkin == null)
                {
                    return new ObjectResult(null);
                }

                var checkinDO = checkin.ToDO();
                var user = DB.FOD<UserEntity>(u => u.User_id == UserIdObj);
                var response = ConvertCheckin(user, checkinDO);
                return new ObjectResult(response);
            }
            else
            {
                var responses = GetCheckinsInRect(req);
                return new ObjectResult(responses);
            }
        }

        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] CheckinRequest req)
        {
            var checkinDO = ReqCityToDO(req);

            await TbDomain.UpdateCheckin(checkinDO);

            return new ObjectResult(null);
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] CheckinRequest req)
        {
            var checkinDO = ReqCityToDO(req);

            await TbDomain.CreateCheckin(checkinDO);

            return new ObjectResult(null);
        }

        private CheckinCityDO ReqCityToDO(CheckinRequest req)
        {
            var checkinDO = new CheckinCityDO
            {
                UserId = UserId,
                WantDo = req.wantDo,
                WantMeet = req.wantMeet,

                MultiPeopleAllowed = req.multiPeopleAllowed,

                FromDate = DateTime.Parse(req.fromDate, DateTimeFormatInfo.InvariantInfo),
                ToDate = DateTime.Parse(req.toDate, DateTimeFormatInfo.InvariantInfo),

                FromAge = req.fromAge,
                ToAge = req.toAge,

                WaitingAtId = req.waitingAtId,
                WaitingAtText = req.waitingAtText,
                WaitingAtType = req.waitingAtType,
                WaitingCoord = req.waitingCoord
            };

            return checkinDO;
        }

        private List<CheckinResponse> GetCheckinsInRect(CheckinQueryRequest req)
        {
            var rect = new RectDO
            {
                LngWest = req.lngWest,
                LngEast = req.lngEast,
                LatNorth = req.latNorth,
                LatSouth = req.latSouth
            };

            var checkins = TbDomain.GetCheckinsInRect(rect);

            var userIds = checkins.Select(s => new ObjectId(s.UserId)).ToList();

            var users = DB.List<UserEntity>(u => userIds.Contains(u.User_id));

            var responses = new List<CheckinResponse>();
            foreach (var c in checkins)
            {
                var u = users.FirstOrDefault(r => r.User_id.ToString() == c.UserId);

                var response = ConvertCheckin(u, c);

                responses.Add(response);
            }

            return responses;
        }

        private CheckinResponse ConvertCheckin(UserEntity u, CheckinCityDO c)
        {
            var response = new CheckinResponse
            {
                userId = c.UserId,
                gender = u.Gender,
                displayName = u.DisplayName,
                languages = u.Languages,
                firstName = u.FirstName,
                lastName = u.LastName,

                interests = u.Interests,
                birthYear = u.BirthYear,
                familyStatus = u.FamilyStatus,
                shortDescription = u.ShortDescription,

                fromAge = c.FromAge,
                toAge = c.ToAge,

                waitingAtId = c.WaitingAtId,
                waitingAtType = c.WaitingAtType,
                waitingAtText = c.WaitingAtText,
                waitingCoord = c.WaitingCoord,

                homeCountry = u.HomeLocation.CountryCode,
                livesCountry = u.CurrentLocation.CountryCode,

                wantDo = c.WantDo,
                wantMeet = c.WantMeet,

                fromDate = c.FromDate,
                toDate = c.ToDate,
            
                multiPeopleAllowed = c.MultiPeopleAllowed,

            };

            return response;
        }


    }



    public class CheckinResponse
    {
        public string userId { get; set; }

        public string displayName { get; set; }
    
        public string firstName { get; set; }
        public string lastName { get; set; }
        
        public string homeCountry { get; set; }
        public string livesCountry { get; set; }

        public List<string> languages { get; set; }        
        public Gender gender { get; set; }

        public List<int> interests { get; set; }
        public int birthYear { get; set; }
        public FamilyStatus familyStatus { get; set; }
        public string shortDescription { get; set; }

        //---
        
        public int wantDo { get; set; }

        public WantMeet wantMeet { get; set; }

        public bool multiPeopleAllowed { get; set; }

        public int fromAge { get; set; }
        public int toAge { get; set; }

        public DateTime waitingUntil { get; set; }

        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }

        public CheckinType checkinType { get; set; }
        public string waitingAtId { get; set; }
        public SourceType waitingAtType { get; set; }
        public string waitingAtText { get; set; }
        public LatLng waitingCoord { get; set; }

    }

    public enum CheckinType { Now, City }
    
   

    public class CheckinQueryRequest
    {
        public string id { get; set; }

        public bool me { get; set; }

        public double latSouth { get; set; }
        public double lngWest { get; set; }
        public double latNorth { get; set; }
        public double lngEast { get; set; }        
    }

    public class CheckinRequest
    {
        public int wantDo { get; set; }

        public WantMeet wantMeet { get; set; }

        public bool multiPeopleAllowed { get; set; }

        public int fromAge { get; set; }
        public int toAge { get; set; }
        
        public int minsWaiting { get; set; }
        
        public string fromDate { get; set; }
        public string toDate { get; set; }
        
        public CheckinType checkinType { get; set; }
        public string waitingAtId { get; set; }
        public SourceType waitingAtType { get; set; }
        public string waitingAtText { get; set; }
        public LatLng waitingCoord { get; set; }
    }
}