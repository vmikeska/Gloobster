using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Friends
{
    public class FriendsEventsController : BaseApiController
    {
        
        public FriendsEventsController(ILogger log, IDbOperations db) : base(log, db)
        {
         
        }

        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(FriendEventRequest req)
        {            
            var responses = new List<FriendEventResponse>();

            try
            {

                var friendsEntity = DB.FOD<FriendsEntity>(f => f.User_id == UserIdObj);

                var friendsTrips = DB.List<TripEntity>(f => friendsEntity.Friends.Contains(f.User_id));

                foreach (var trip in friendsTrips)
                {
                    bool youParticipant = trip.Participants.Any(p => p.User_id == UserIdObj);

                    bool passed = trip.FriendsPublic || youParticipant;

                    if (passed)
                    {
                        var startEnd = TripDomain.GetTripFromTo(trip);
                        
                        var filterFrom = req.from.ToDate('_').ToDateStart(DateTimeKind.Utc);
                        var filterTo = req.to.ToDate('_').ToDateStart(DateTimeKind.Utc);
                        
                        bool overlap = startEnd.Item1 < filterTo && filterFrom < startEnd.Item2;

                        if (overlap)
                        {
                            var resp = new FriendEventResponse
                            {
                                name = trip.Name,
                                ownerId = trip.User_id.ToString(),
                                tripId = trip.id.ToString(),
                                start = startEnd.Item1,
                                end = startEnd.Item2
                            };
                            responses.Add(resp);
                        }                        
                    }
                }
            }
            catch (Exception exc)
            {
                //todo: log
            }

            return new ObjectResult(responses);
        }
        
    }

    public class FriendEventRequest
    {
        public string from { get; set; }
        public string to { get; set; }
    }

    public class FriendEventResponse
    {
        public string tripId { get; set; }
        public string ownerId { get; set; }
        public string name { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
    }
}