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
        public async Task<IActionResult> Get(CheckinCityQueryRequest req)
        {
            if (req.type == "id")
            {
                var checkinIdObj = new ObjectId(req.id);
                var checkin = DB.FOD<CheckinCityEntity>(u => u.id == checkinIdObj);

                if (checkin == null)
                {
                    return new ObjectResult(null);
                }

                var checkinDO = checkin.ToDO();
                var user = DB.FOD<UserEntity>(u => u.User_id == checkin.User_id);
                var response = ConvertCheckin(user, checkinDO);
                return new ObjectResult(response);
            }

            if (req.type == "my")
            {               
                var checkins = DB.List<CheckinCityEntity>(u => u.User_id == UserIdObj);
                
                var checkinsDO = checkins.Select(c => c.ToDO()).ToList();                
                var responses = checkinsDO.Select(c => ConvertCheckin(User, c)).ToList();
                return new ObjectResult(responses);
            }

            if (req.type == "query")
            {
                var responses = GetCheckinsInRect(req);
                
                bool showAll = req.filter == "all";
                bool justMine = req.filter == "mine";

                if (justMine)
                {
                    responses = responses.Where(r => r.userId == UserId).ToList();
                    responses = FilterDate(responses, req);
                    return new ObjectResult(responses);
                }
                
                if (!showAll)
                {
                    responses = Query(responses, req);
                }

                //filter out mine
                responses = responses.Where(r => r.userId != UserId).ToList();

                return new ObjectResult(responses);
            }

            return null;
        }

        private List<CheckinResponse> FilterDate(List<CheckinResponse> responses, CheckinCityQueryRequest req)
        {
            var fromDate = req.fromDate.ToDate('_');
            var toDate = req.toDate.ToDate('_');

            responses =
                responses.Where(r =>
                {
                    if (r.fromDate.IsGreaterOrEqualThen(toDate) || r.toDate.IsLowerOrEqualThen(fromDate))
                    {
                        return false;
                    }
                    return true;
                })
                .ToList();

            return responses;
        }


        private List<CheckinResponse> Query(List<CheckinResponse> responses, CheckinCityQueryRequest req)
        {
            bool showAllFilteredByGenders = string.IsNullOrEmpty(req.filter);

            responses = responses.Where(r => CheckinFilterUtils.HasGenderMatch(r.wantMeet, User.Gender)).ToList();

            responses = responses.Where(r => r.languages.Intersect(req.lang).Any()).ToList();

            responses = FilterDate(responses, req);
            
            if (showAllFilteredByGenders)
            {
                return responses;
            }

            var wantDos = req.filter.Split(',').Select(int.Parse).ToList();

            responses = responses.Where(r => r.wantDo.Intersect(wantDos).Any()).ToList();

            return responses;
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

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(string id)
        {
            bool deleted = await TbDomain.DeleteCheckin(id, UserId);            
            return new ObjectResult(deleted);
        }

        private CheckinCityDO ReqCityToDO(CheckinRequest req)
        {
            var checkinDO = new CheckinCityDO
            {
                UserId = UserId,
                WantDo = req.wantDo,
                WantMeet = req.wantMeet,

                MultiPeopleAllowed = req.multiPeopleAllowed,

                FromDate = req.fromDate,
                ToDate = req.toDate,

                FromAge = req.fromAge,
                ToAge = req.toAge,

                WaitingAtId = req.waitingAtId,
                WaitingAtText = req.waitingAtText,
                WaitingAtType = req.waitingAtType,
                WaitingCoord = req.waitingCoord,

                Message = req.message
            };

            return checkinDO;
        }

        private List<CheckinResponse> GetCheckinsInRect(CheckinCityQueryRequest req)
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

                id = c.CheckinId,

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

                message = c.Message

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
        public int? birthYear { get; set; }
        public FamilyStatus familyStatus { get; set; }
        public string shortDescription { get; set; }

        //---
        
        public string id { get; set; }

        public List<int> wantDo { get; set; }

        public WantMeet wantMeet { get; set; }

        public bool multiPeopleAllowed { get; set; }

        public int fromAge { get; set; }
        public int toAge { get; set; }

        public DateTime waitingUntil { get; set; }

        public Date fromDate { get; set; }
        public Date toDate { get; set; }

        public CheckinType checkinType { get; set; }
        public string waitingAtId { get; set; }
        public SourceType waitingAtType { get; set; }
        public string waitingAtText { get; set; }
        public LatLng waitingCoord { get; set; }

        public string message { get; set; }

    }

    public enum CheckinType { Now, City }
    
   

    public class CheckinCityQueryRequest
    {
        public string type { get; set; }
        
        public string id { get; set; }
        
        public string filter { get; set; }

        public List<string> lang { get; set; }

        public double latSouth { get; set; }
        public double lngWest { get; set; }
        public double latNorth { get; set; }
        public double lngEast { get; set; }        

        public string fromDate { get; set; }
        public string toDate { get; set; }        
    }

    public class CheckinRequest
    {
        public List<int> wantDo { get; set; }

        public WantMeet wantMeet { get; set; }

        public bool multiPeopleAllowed { get; set; }

        public int fromAge { get; set; }
        public int toAge { get; set; }
        
        public int minsWaiting { get; set; }
        
        public Date fromDate { get; set; }
        public Date toDate { get; set; }

        public string message { get; set; }

        public CheckinType checkinType { get; set; }
        public string waitingAtId { get; set; }
        public SourceType waitingAtType { get; set; }
        public string waitingAtText { get; set; }
        public LatLng waitingCoord { get; set; }
    }
}