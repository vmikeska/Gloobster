using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainModels.Trips;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.Mappers;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
    public class TripListController : BaseApiController
    {
        public ITripDomain TripDomain { get; set; }

        public TripListController(ITripDomain tripDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            TripDomain = tripDomain;
        }


        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get()
        {
            var outTrips = new List<TripItemResponse>();

            var part = new List<TripEntity>();

            var trips = DB.List<TripEntity>(t => t.User_id == UserIdObj);
            part.AddRange(trips);

            var yourTrips = trips.Select(ConvertTrip).ToList();
            outTrips.AddRange(yourTrips);


            var query = $"{{ 'Participants.User_id': ObjectId('{UserId}')}}";
            var invitedTrips = await DB.FindAsync<TripEntity>(query);
            part.AddRange(invitedTrips);

            var invTrips = invitedTrips.Select(ConvertTrip).ToList();
            outTrips.AddRange(invTrips);


            var userIds = part.SelectMany(t => t.Participants.Select(p => p.User_id)).ToList();

            userIds.AddRange(part.Select(i => i.User_id).ToList());


            var users = DB.List<UserEntity>(u => userIds.Contains(u.User_id));

            foreach (var outTrip in outTrips)
            {
                var tid = new ObjectId(outTrip.id);

                var origTrip = part.First(t => t.id == tid);

                var owner = users.FirstOrDefault(u => u.User_id == tid);

                if (owner != null)
                {
                    outTrip.ownerName = owner.DisplayName;
                }
                
                var participants = origTrip.Participants.Select(p =>
                {
                    var user = users.FirstOrDefault(u => u.User_id == p.User_id);

                    var participant = new UserItemResponse
                    {
                        id = p.User_id.ToString(),
                        name = user.DisplayName
                    };

                    return participant;

                }).ToList();

                outTrip.participants = participants;                
            }

            return new ObjectResult(outTrips);            
        }

        private TripItemResponse ConvertTrip(TripEntity t)
        {
            var ft = TripUtils.GetTripFromTo(t);
            var tripEnd = ft.Item2;

            bool isOld = tripEnd < DateTime.UtcNow;

            var tir = new TripItemResponse
            {
                hasSmallPicture = t.HasSmallPicture,
                id = t.id.ToString(),
                isOwner = (t.User_id.ToString() == UserId),
                name = t.Name,
                ownerId = t.User_id.ToString(),
                //ownerName = User.DisplayName,
                fromDate = ft.Item1,
                toDate = ft.Item2,
                isOld = isOld
            };

            return tir;
        }

    }

    public class TripItemResponse
    {        
        public string id { get; set; }

        public string name { get; set; }
        
        public bool isOwner { get; set; }
        public string ownerName { get; set; }
        public string ownerId { get; set; }

        public bool isOld { get; set; }

        public bool hasSmallPicture { get; set; }

        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }

        public List<UserItemResponse> participants { get; set; }
        
    }

    public class UserItemResponse
    {
        public string id { get; set; }
        public string name { get; set; }
    }
}