using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
    public interface IEntitiesDemandor
    {        
        Task<TripEntity> CreateNewTripEntity(string name, ObjectId userIdObj);
    }

    public interface IVisitedEntityRequestor
    {
        Task<VisitedEntity> GetOrCreate(string userId);
    }

    
    public class VisitedEntityRequestor: IVisitedEntityRequestor
    {
        public IDbOperations DB { get; set; }

        public async Task<VisitedEntity> GetOrCreate(string userId)
        {
            var userIdObj = new ObjectId(userId);
            var e = DB.FOD<VisitedEntity>(v => v.User_id == userIdObj);
            if (e != null)
            {
                return e;
            }
            
            e = new VisitedEntity
            {
                id = ObjectId.GenerateNewId(),
                User_id = userIdObj,
                Places = new List<VisitedPlaceSE>(),
                Cities = new List<VisitedCitySE>(),
                Countries = new List<VisitedCountrySE>(),
                States = new List<VisitedStateSE>()
            };
            await DB.SaveAsync(e);
            return e;
        }

        public VisitedEntity Get(string userId)
        {                            
            var userIdObj = new ObjectId(userId);
            var e = DB.FOD<VisitedEntity>(v => v.User_id == userIdObj);
            if (e != null)
            {
                return e;
            }

            throw new Exception($"VisitedEntity with userId {userId} should exists, but it doesnt");
        }
    }

    public class EntitiesDemandor : IEntitiesDemandor
    {
        public IDbOperations DB { get; set; }
        
        public async Task<TripEntity> CreateNewTripEntity(string name, ObjectId userIdObj)
        {
            var travel = new TripTravelSE
            {
                id = ObjectId.GenerateNewId(),
                Type = TravelType.Plane,
                LeavingDateTime = DateTime.UtcNow,
                ArrivingDateTime = DateTime.UtcNow.AddDays(1),
                Description = ""
            };

            var firstPlace = new TripPlaceSE
            {
                id = ObjectId.GenerateNewId(),
                ArrivingId = ObjectId.Empty,
                LeavingId = travel.id,
                OrderNo = 1,
                Place = new PlaceSE
                {
                    SourceType = SourceType.City,
                    SourceId = "2643743",
                    SelectedName = "London, GB",
                    Coordinates = new LatLng { Lat = 51.50853, Lng = -0.12574 }
                },
                Description = "",
                WantVisit = new List<PlaceIdSE>()
            };

            var secondPlace = new TripPlaceSE
            {
                id = ObjectId.GenerateNewId(),
                ArrivingId = travel.id,
                LeavingId = ObjectId.Empty,
                OrderNo = 2,
                Place = new PlaceSE
                {
                    SourceType = SourceType.City,
                    SourceId = "5128581",
                    SelectedName = "New York, US",
                    Coordinates = new LatLng { Lat = 40.71427, Lng = -74.00597 }
                },
                Description = "",
                WantVisit = new List<PlaceIdSE>(),
            };

            var tripEntity = new TripEntity
            {
                id = ObjectId.GenerateNewId(),
                CreatedDate = DateTime.UtcNow,
                Name = name,
                User_id = userIdObj,
                Comments = new List<CommentSE>(),
                Files = new List<FileSE>(),
                Travels = new List<TripTravelSE> { travel },
                Places = new List<TripPlaceSE> { firstPlace, secondPlace },
                Participants = new List<ParticipantSE>(),
                FilesPublic = new List<FilePublicSE>(),
                NotesPublic = false,
                FriendsPublic = true,
                AllowToRequestJoin = false,
                SharingCode = null,
                Notes = "",
                Description = "",
                HasBigPicture = false,
                HasSmallPicture = false
            };

            await DB.SaveAsync(tripEntity);

            return tripEntity;
        }
        
    }
}