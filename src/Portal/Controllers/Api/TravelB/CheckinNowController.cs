using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainModels.TravelB;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.TravelB;
using Gloobster.Entities;
using Gloobster.Entities.TravelB;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class CheckinNowController: BaseApiController
    {
        public CheckinNowDomain TbDomain { get; set; }
        
        public CheckinNowController(ILogger log, IDbOperations db) : base(log, db)
        {
            TbDomain = new CheckinNowDomain
            {
                DB = db
            };
        }
        
        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(CheckinNowQueryRequest req)
        {
            //todo: move into a service
            await TbDomain.HistorizeCheckins();

            if (req.type == "id")                
            {
                var userIdObj = new ObjectId(req.id);
                var checkin = DB.FOD<CheckinNowEntity>(u => u.User_id == userIdObj);

                if (checkin == null)
                {
                    return new ObjectResult(null);
                }

                var checkinDO = checkin.ToDO();
                var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);
                var response = ConvertCheckin(user, checkinDO);
                return new ObjectResult(response);
            }

            if (req.type == "me")
            {
                var checkin = DB.FOD<CheckinNowEntity>(u => u.User_id == UserIdObj);

                if (checkin == null)
                {
                    return new ObjectResult(null);
                }

                var checkinDO = checkin.ToDO();
                var user = DB.FOD<UserEntity>(u => u.User_id == UserIdObj);
                CheckinResponse response = ConvertCheckin(user, checkinDO);
                return new ObjectResult(response);
            }

            if (req.type == "query")
            {
                List<CheckinResponse> responses = GetCheckinsInRect(req);

                bool noFilter = string.IsNullOrEmpty(req.filter);
                bool genderFilter = req.filter == "gender";
                bool fullFilter = req.filter == "full";

                if (noFilter)
                {
                    return new ObjectResult(responses);
                }

                responses = responses.Where(r => CheckinFilterUtils.HasGenderMatch(r.wantMeet, User.Gender)).ToList();

                if (genderFilter)
                {
                    return new ObjectResult(responses);
                }
                
                //since here full filter

                if (req.lang != null && req.lang.Any())
                {
                    responses = responses.Where(r => r.languages.Intersect(req.lang).Any()).ToList();
                }

                var wantDos = string.IsNullOrEmpty(req.wds) ? new List<int>() : req.wds.Split(',').Select(int.Parse).ToList();
                if (wantDos.Any())
                {
                    responses = responses.Where(r => r.wantDo.Intersect(wantDos).Any()).ToList();
                }
                
                return new ObjectResult(responses);
            }

            return null;
        }
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] CheckinRequest req)
        {
            var validator = new CheckinValidator();
            validator.Validate(req);

            if (!validator.IsValid)
            {
                throw new Exception("Invalid checkin now");
            }

            var checkinDO = ReqNowToDO(req);
            
            await TbDomain.CreateCheckin(checkinDO);

            return new ObjectResult(true);
        }

        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] CheckinRequest req)
        {
            var validator = new CheckinValidator();
            validator.Validate(req);

            if (!validator.IsValid)
            {
                throw new Exception("Invalid checkin now");
            }

            var checkinDO = ReqNowToDO(req);
            checkinDO.WaitingUntil = DateTime.UtcNow.AddMinutes(req.minsWaiting);

            await TbDomain.UpdateCheckin(checkinDO);

            return new ObjectResult(true);
        }

        [AuthorizeApi]
        [HttpDelete]
        public async Task<IActionResult> Delete()
        {
            await TbDomain.DeleteCheckin(UserId);

            return new ObjectResult(true);
        }

        
        private CheckinNowDO ReqNowToDO(CheckinRequest req)
        {
            var checkinDO = new CheckinNowDO
            {
                CheckinId = req.id,
                UserId = UserId,
                WantDo = req.wantDo,
                WantMeet = req.wantMeet,                
                MultiPeopleAllowed = req.multiPeopleAllowed,
                
                FromAge = req.fromAge,
                ToAge = req.toAge,

                WaitingUntil = DateTime.UtcNow.AddMinutes(req.minsWaiting),

                WaitingAtId = req.waitingAtId,
                WaitingAtText = req.waitingAtText,
                WaitingAtType = req.waitingAtType,
                WaitingCoord = req.waitingCoord,

                Message = req.message
            };

            return checkinDO;
        }
        
        private List<CheckinResponse> GetCheckinsInRect(CheckinNowQueryRequest req)
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

        private CheckinResponse ConvertCheckin(UserEntity u, CheckinNowDO c)
        {
            var response = new CheckinResponse
            {
                id =  c.CheckinId,
                userId = c.UserId,
                gender = u.Gender,
                displayName = u.DisplayName,
                languages = u.Languages,
                firstName = u.FirstName,
                lastName = u.LastName,

                interests = u.Interests,
                birthYear = u.BirthYear.Value,
                familyStatus = u.FamilyStatus,
                shortDescription = u.ShortDescription,

                fromAge = c.FromAge,
                toAge = c.ToAge,

                waitingAtId = c.WaitingAtId,
                waitingAtType = c.WaitingAtType,
                waitingAtText = c.WaitingAtText,
                waitingCoord = c.WaitingCoord,

                message = c.Message,
                
                wantDo = c.WantDo,
                wantMeet = c.WantMeet,
                
                waitingUntil = c.WaitingUntil,
                
                multiPeopleAllowed = c.MultiPeopleAllowed
            };

            if (u.CurrentLocation != null)
            {
                response.livesCountry = u.CurrentLocation.CountryCode;
            }

            if (u.HomeLocation != null)
            {
                response.homeCountry = u.HomeLocation.CountryCode;
            }

            return response;
        }


    }

    public class CheckinNowQueryRequest
    {
        public string type { get; set; }

        public string id { get; set; }

        public string filter { get; set; }

        public List<string> lang { get; set; }
        public string wds { get; set; }

        public double latSouth { get; set; }
        public double lngWest { get; set; }
        public double latNorth { get; set; }
        public double lngEast { get; set; }
        
    }
}