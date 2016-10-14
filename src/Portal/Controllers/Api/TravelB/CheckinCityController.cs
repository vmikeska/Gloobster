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
using Gloobster.Portal.Controllers.Api.Wiki;

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
            await TbDomain.HistorizeCheckins();

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
                List<CheckinResponse> responses = GetCheckinsInRect(req);
                responses = FilterDate(responses, req);

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

                if (req.lang.Any())
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

        private List<CheckinResponse> FilterDate(List<CheckinResponse> responses, CheckinCityQueryRequest req)
        {
            var fromDate = req.fromDate.ToDate('_');
            var toDate = req.toDate.ToDate('_');

            responses =
                responses.Where(r =>
                {
                    bool isPast = r.fromDate.IsGreaterOrEqualThen(toDate);
                    bool isFuture = fromDate.IsGreaterOrEqualThen(r.toDate);

                    if (isPast || isFuture)
                    {
                        return false;
                    }
                    return true;
                })
                    .ToList();

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
            var validator = new CheckinValidator();
            validator.Validate(req);

            if (!validator.IsValid)
            {
                throw new Exception("Invalid checkin city");
            }

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
                CheckinId = req.id,
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
                
                wantDo = c.WantDo,
                wantMeet = c.WantMeet,

                fromDate = c.FromDate,
                toDate = c.ToDate,

                multiPeopleAllowed = c.MultiPeopleAllowed,

                message = c.Message

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

    public enum CheckinType
    {
        Now,
        City
    }



    public class CheckinCityQueryRequest
    {
        public string type { get; set; }

        public string id { get; set; }

        public string filter { get; set; }
        public string wds { get; set; }

        public List<string> lang { get; set; }

        public double latSouth { get; set; }
        public double lngWest { get; set; }
        public double latNorth { get; set; }
        public double lngEast { get; set; }

        public string fromDate { get; set; }
        public string toDate { get; set; }
    }

    public class CheckinValidator
    {
        public bool IsValid = true;

        public void Validate(CheckinRequest req)
        {
            Check(req.wantDo.Count > 0);
            Check(req.fromAge >= 18);
            
            if (req.checkinType == CheckinType.Now)
            {
                Check(req.waitingAtType == SourceType.S4 || req.waitingAtType == SourceType.Yelp);

                Check(req.minsWaiting >= 30);
                Check(req.minsWaiting <= 240);
            }

            if (req.checkinType == CheckinType.City)
            {
                Check(req.waitingAtType == SourceType.City);

                //check regular range ?
                Check(req.fromDate != null);
                Check(req.toDate != null);
            }

            //check if it is real ?
            Check(!string.IsNullOrEmpty(req.waitingAtId));
            Check(!string.IsNullOrEmpty(req.waitingAtText));
            Check(req.waitingCoord != null);            
        }

        private void Check(bool state)
        {
            if (!state)
            {
                IsValid = false;
            }
        }

    }


    public class CheckinRequest
    {
        public string id { get; set; }

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