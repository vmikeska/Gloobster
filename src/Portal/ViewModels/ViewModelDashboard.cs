using System;
using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Entities.SearchEngine;
using Gloobster.Entities.Trip;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public class UserLogViewModel
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }
    }

    public class ViewModelDashboard : ViewModelBase
    {
        public const string LogsLangModule = "userLogs";

        public const string CreatedTripTmp = "CreatedTrip";

        public const string NewCityAdded = "NewCityAdded";
        public const string NewCityAndOthersAdded = "NewCityAndOthersAdded";
        public const string BecameFriends = "BecameFriends";
        
        public List<TripEntity> Trips { get; set; }
        public List<string> CCs { get; set; }
        public bool HasAirs { get; set; }
        public bool HasDests { get; set; }
        public List<UserLogViewModel> Logs { get; set; }
        public List<UserDO> FbFriends { get; set; }

        public bool HasFriends { get; set; }

        private void LoadUserLogs(ObjectId userIdObj)
        {
            var friends = DB.FOD<FriendsEntity>(f => f.User_id == userIdObj);

            HasFriends = friends.Friends.Any();

            var userLogs = DB.List<UserLogEntity>(u => friends.Friends.Contains(u.User_id));

            var users = DB.List<UserEntity>(u => friends.Friends.Contains(u.User_id));

            var timeout = DateTime.UtcNow.AddDays(-21);

            var passedLogs = new List<UserLogViewModel>();

            foreach (var userLog in userLogs)
            {
                foreach (var log in userLog.Logs)
                {
                    bool isNew = log.Created > timeout;
                    if (isNew)
                    {
                        var user = users.FirstOrDefault(u => u.User_id == userLog.User_id);
                        if (user == null)
                        {
                            continue;                            
                        }

                        var content = BuildLogText(userLog.User_id.ToString(), log);

                        var outLog = new UserLogViewModel
                        {
                            Id = log.id.ToString(),
                            UserId = user.User_id.ToString(),
                            Name = user.DisplayName,
                            Content = content,
                            Created = log.Created
                        };

                        passedLogs.Add(outLog);
                    }
                }    
            }

            Logs = passedLogs.OrderByDescending(o => o.Created).ToList();            
        }

        private void DetectFbFriends(IFacebookFriendsService fbFriendsSvc, string userId)
        {
            FbFriends = new List<UserDO>();

            var uid = new ObjectId(userId);
            var friends = DB.FOD<FriendsEntity>(f => f.User_id == uid);

            if (friends == null)
            {
                return;
            }
            
            try
            {                
                var fbFriends = fbFriendsSvc.GetFriends(userId);
                if (fbFriends != null)
                {
                    FbFriends = fbFriends.Where(f =>
                    {
                        var userIdObj = new ObjectId(f.UserId);
                        return !friends.Friends.Contains(userIdObj) &&
                               !friends.Proposed.Contains(userIdObj) &&
                               !friends.AwaitingConfirmation.Contains(userIdObj);
                    }).ToList();
                }
            }
            catch (Exception exc)
            {
                //todo: add log
            }

            
        }

        public string BuildLogText(string userId, UserLogSE log)
        {
            if (log.Type == LogType.Trip)
            {
                return BuildTripLogText(userId, log);
            }

            if (log.Type == LogType.Pins)
            {
                return BuildPinsLogText(userId, log);
            }

            if (log.Type == LogType.Friend)
            {
                return BuildFriendsLogText(userId, log);
            }
            
            return string.Empty;
        }

        private string BuildTripLogText(string userId, UserLogSE log)
        {
            var txtBase = W(CreatedTripTmp, LogsLangModule);

            var url = $"/{RoutingConsts.TripMenuName}/{log.Major_id}";

            var txtFormated = string.Format(txtBase, url, log.Param1);
            return txtFormated;
        }

        private string BuildPinsLogText(string userId, UserLogSE log)
        {
            string txtFormated;

            var cities = log.Param1.Split('|').ToList();
            int totalCount = int.Parse(log.Param2);

            bool simple = totalCount == cities.Count;
            
            string citiesStr = string.Join(" ", cities);
            
            if (simple)
            {
                var txtBase = W(NewCityAdded, LogsLangModule);
                
                txtFormated = string.Format(txtBase, citiesStr);
            }
            else
            {
                var txtBase = W(NewCityAndOthersAdded, LogsLangModule);
                int othersCount = totalCount - cities.Count;
                txtFormated = string.Format(txtBase, citiesStr, othersCount);
            }
            
            return txtFormated;
        }

        private string BuildFriendsLogText(string userId, UserLogSE log)
        {
            var txtBase = W(BecameFriends, LogsLangModule);

            var link = $"/{RoutingConsts.UserDetailMenuName}/{log.Major_id}";

            var txtFormated = string.Format(txtBase, link, log.Param1);
            
            return txtFormated;
        }

        public async Task Init(IDbOperations db, string userId, ITripDomain tripDomain, IFacebookFriendsService fbFriendsSvc)
        {
            var userIdObj = new ObjectId(userId);

            LoadUserLogs(userIdObj);

            DetectFbFriends(fbFriendsSvc, userId);

            var trips = DB.List<TripEntity>(t => t.User_id == userIdObj);
            
            if (!trips.Any())
            {
                var defTripName = W("DefaultTripName", "pageTrips");
                string tripId = await tripDomain.CreateNewTrip(defTripName, UserId, true);
                trips = DB.List<TripEntity>(t => t.User_id == userIdObj);
            }

            Trips = trips;
            CCs = new List<string>();

            var visited = DB.FOD<VisitedEntity>(e => e.User_id == userIdObj);
            if (visited != null)
            {
                CCs = visited.Countries.Select(c => c.CountryCode2).ToList();
            }

            HasAirs = false;
            var airs = DB.FOD<UserAirportsEntity>(u => u.User_id == userIdObj);
            if (airs != null)
            {
                HasAirs = airs.Airports.Any();
            }

            HasDests = false;
            var dealsAnytime = DB.FOD<DealsAnytimeEntity>(d => d.User_id == userIdObj);

            if (dealsAnytime != null)
            {
                HasDests = dealsAnytime.Cities.Any() || dealsAnytime.CountryCodes.Any();
            }
            if (!HasDests)
            {
                var dealsWeekend = DB.FOD<DealsWeekendEntity>(d => d.User_id == userIdObj);
                if (dealsWeekend != null)
                {
                    HasDests = dealsWeekend.Cities.Any() || dealsWeekend.CountryCodes.Any();
                }
            }
        }
    }
}