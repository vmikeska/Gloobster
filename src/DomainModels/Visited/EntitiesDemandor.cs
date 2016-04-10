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
        Task<VisitedEntity> GetVisitedAsync(ObjectId userIdObj);
        VisitedResult VisitedExists(ObjectId userIdObj);        
        Task<TripEntity> CreateNewTripEntity(string name, ObjectId userIdObj);        
    }

    public class VisitedResult
    {
        public VisitedEntity Entity { get; set; }
        public bool Exists { get; set; }
    }
    
    public class EntitiesDemandor : IEntitiesDemandor
    {
        public IDbOperations DB { get; set; }

        //todo: remove
        public VisitedResult VisitedExists(ObjectId userIdObj)
        {
            var visited = DB.FOD<VisitedEntity>(u => u.User_id == userIdObj);
            return new VisitedResult
            {
                Exists = visited != null,
                Entity = visited
            };
        }
        
        public async Task<VisitedEntity> GetVisitedAsync(ObjectId userIdObj)
        {
            var visited = DB.FOD<VisitedEntity>(u => u.User_id == userIdObj);
            if (visited == null)
            {
                var newVisited = new VisitedEntity
                {
                    User_id = userIdObj,
                    Places = new List<VisitedPlaceSE>(),
                    Cities = new List<VisitedCitySE>(),
                    Countries = new List<VisitedCountrySE>(),
                    States = new List<VisitedStateSE>()
                };
                await DB.SaveAsync(newVisited);
                return newVisited;
            }

            return visited;
        }

        public async Task<TripEntity> CreateNewTripEntity(string name, ObjectId userIdObj)
        {
            var travel = new TripTravelSE
            {
                id = ObjectId.GenerateNewId(),
                Type = TravelType.Plane,
                LeavingDateTime = DateTime.UtcNow,
                ArrivingDateTime = DateTime.UtcNow.AddDays(1),
                Description = "Here you can place notes for your travel"
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