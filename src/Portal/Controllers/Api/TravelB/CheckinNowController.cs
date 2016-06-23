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
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class CheckinFilterUtils
    {
        
        public static bool HasGenderMatch(WantMeet wantMeet, Gender gender)
        {
            if (wantMeet == WantMeet.All)
            {
                return true;
            }

            if (wantMeet == WantMeet.Man && gender == Gender.M)
            {
                return true;
            }

            if (wantMeet == WantMeet.Woman && gender == Gender.F)
            {
                return true;
            }

            return false;
        }
    }

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

        //todo: move into a service
        private async void RemoveOldCheckins()
        {
            var deleted = await DB.DeleteAsync<CheckinNowEntity>(c => c.WaitingUntil < DateTime.UtcNow);            
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(CheckinQueryRequest req)
        {
            RemoveOldCheckins();

            if (!string.IsNullOrEmpty(req.id))
            {
                var userIdObj = new ObjectId(req.id);
                var checkin = DB.FOD<CheckinNowEntity>(u => u.User_id == userIdObj);

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
                var checkin = DB.FOD<CheckinNowEntity>(u => u.User_id == UserIdObj);

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

                bool showAllFilteredByGenders = string.IsNullOrEmpty(req.filter);
                bool showAll = req.filter == "all";

                if (showAll)
                {
                    //todo: later remove my checkin. Not only here, in all if branches
                    return new ObjectResult(responses);
                }

                responses = responses.Where(r => CheckinFilterUtils.HasGenderMatch(r.wantMeet, User.Gender)).ToList();

                if (showAllFilteredByGenders)
                {
                    return new ObjectResult(responses);
                }

                var wantDos = req.filter.Split(',').Select(int.Parse).ToList();


                responses = responses.Where(r => r.wantDo.Intersect(wantDos).Any()).ToList();
                
                
                return new ObjectResult(responses);
            }            
        }
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] CheckinRequest req)
        {
            var checkinDO = ReqNowToDO(req);
            
            await TbDomain.CreateCheckin(checkinDO);

            return new ObjectResult(null);
        }

        private CheckinNowDO ReqNowToDO(CheckinRequest req)
        {
            var checkinDO = new CheckinNowDO
            {
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
                
                waitingUntil = c.WaitingUntil,
                
                multiPeopleAllowed = c.MultiPeopleAllowed,

            };

            return response;
        }


    }
}