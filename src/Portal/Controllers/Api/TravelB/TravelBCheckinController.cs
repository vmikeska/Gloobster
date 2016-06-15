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
using Gloobster.Entities;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
	public class TravelBCheckinController: BaseApiController
	{
        public TravelBDomain TbDomain { get; set; }
        
        public TravelBCheckinController(ILogger log, IDbOperations db) : base(log, db)
        {
            TbDomain = new TravelBDomain
            {
                DB = db
            };
        }

        [AuthorizeApi]
        [HttpGet]
	    public async Task<IActionResult> Get(CheckinQueryRequest req)
	    {	        
	        if (req.me)
	        {
                var checkin = DB.FOD<TravelBCheckinEntity>(u => u.User_id == UserIdObj);

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

	    private List<TravelBCheckinResponse> GetCheckinsInRect(CheckinQueryRequest req)
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

            var responses = new List<TravelBCheckinResponse>();
            foreach (var c in checkins)
            {
                var u = users.FirstOrDefault(r => r.User_id.ToString() == c.UserId);

                var response = ConvertCheckin(u, c);

                responses.Add(response);                
            }

	        return responses;
	    }

	    private TravelBCheckinResponse ConvertCheckin(UserEntity u, TravelBCheckinDO c)
	    {
            var response = new TravelBCheckinResponse
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
                waitingUntil = c.WaitingUntil,

                checkinType = c.CheckinType,
                multiPeopleAllowed = c.MultiPeopleAllowed,

            };

	        return response;
	    }

        [HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody] CheckinRequest req)
		{
		    var checkinDO = new TravelBCheckinDO
		    {
                UserId = UserId,
		        WantDo = req.wantDo,
		        WantMeet = req.wantMeet,
		        CheckinType = req.checkinType,
		        MultiPeopleAllowed = req.multiPeopleAllowed,

		        FromDate = DateTime.Parse(req.fromDate, DateTimeFormatInfo.InvariantInfo),
		        ToDate = DateTime.Parse(req.toDate, DateTimeFormatInfo.InvariantInfo),

		        FromAge = req.fromAge,
		        ToAge = req.toAge,

                WaitingUntil = DateTime.UtcNow.AddMinutes(req.minsWaiting),
		        
		        WaitingAtId = req.waitingAtId,
		        WaitingAtText = req.waitingAtText,
		        WaitingAtType = req.waitingAtType,
                WaitingCoord = req.waitingCoord
		    };

		    await TbDomain.CreateCheckin(checkinDO);

            return new ObjectResult(null);
		}
        
	}

    public class TravelBCheckinResponse
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

    public class TravelBCheckinDO
    {
        public string UserId { get; set; }

        public int WantDo { get; set; }

        public WantMeet WantMeet { get; set; }

        public bool MultiPeopleAllowed { get; set; }

        public int FromAge { get; set; }
        public int ToAge { get; set; }

        public DateTime WaitingUntil { get; set; }
        
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public CheckinType CheckinType { get; set; }
        public string WaitingAtId { get; set; }
        public SourceType WaitingAtType { get; set; }
        public string WaitingAtText { get; set; }
        public LatLng WaitingCoord { get; set; }

    }

    public static class CheckinMappers
    {
        public static TravelBCheckinDO ToDO(this TravelBCheckinEntity e)
        {
            var d = new TravelBCheckinDO
            {
                UserId = e.User_id.ToString(),
                MultiPeopleAllowed = e.MultiPeopleAllowed,
                WaitingAtId = e.WaitingAtId,
                WaitingAtType = e.WaitingAtType,
                WaitingCoord = e.WaitingCoord,
                FromDate = e.FromDate,
                ToDate = e.ToDate,
                WantDo = e.WantDo,
                WaitingAtText = e.WaitingAtText,
                FromAge = e.FromAge,
                CheckinType = e.CheckinType,
                WaitingUntil = e.WaitingUntil,
                WantMeet = e.WantMeet,
                ToAge = e.ToAge
            };

            return d;
        }

        public static TravelBCheckinEntity ToEntity(this TravelBCheckinDO d)
        {
            var e = new TravelBCheckinEntity
            {
                User_id = new ObjectId(d.UserId),
                MultiPeopleAllowed = d.MultiPeopleAllowed,
                WaitingAtId = d.WaitingAtId,
                WaitingAtType = d.WaitingAtType,
                WaitingCoord = d.WaitingCoord,
                FromDate = d.FromDate,
                ToDate = d.ToDate,
                WantDo = d.WantDo,
                WaitingAtText = d.WaitingAtText,
                FromAge = d.FromAge,
                CheckinType = d.CheckinType,
                WaitingUntil = d.WaitingUntil,
                WantMeet = d.WantMeet,
                ToAge = d.ToAge
            };

            return e;
        }
        
    }

    public class TravelBDomain
    {
        public IDbOperations DB { get; set; }
        

        public List<TravelBCheckinDO> GetCheckinsInRect(RectDO rect)
        {
            var checkins = DB.List<TravelBCheckinEntity>();

            var outCheckins = new List<TravelBCheckinDO>();
            foreach (var checkin in checkins)
            {
                bool withinRect = WithinRectangle(rect, checkin.WaitingCoord);
                if (withinRect)
                {
                    var checkinDo = checkin.ToDO();
                    outCheckins.Add(checkinDo);
                }
            }

            return outCheckins;
        }

        private bool WithinRectangle(RectDO rectDO, LatLng coord)
        {
            if (coord.Lat > rectDO.LatNorth)
                return false;
            if (coord.Lat < rectDO.LatSouth)
                return false;

            if (rectDO.LngEast >= rectDO.LngWest)
                return ((coord.Lng >= rectDO.LngWest) && (coord.Lng <= rectDO.LngEast));
            else
                return (coord.Lng >= rectDO.LngWest);

            return false;
        }

        //private int GetDistance(LatLng latLng1, LatLng latLng2)
        //{
        //    var sCoord = new GeoCoordinate(latLng1.Lat, latLng1.Lng);
        //    var eCoord = new GeoCoordinate(latLng2.Lat, latLng2.Lng);

        //    double dist = sCoord.GetDistanceTo(eCoord);

        //    return (int)(dist / 1000);
        //}

        public async Task CreateCheckin(TravelBCheckinDO checkin)
        {
            var entity = checkin.ToEntity();
            entity.id = ObjectId.GenerateNewId();
            
            await DB.SaveAsync(entity);
        }
    }

    public class CheckinQueryRequest
    {
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