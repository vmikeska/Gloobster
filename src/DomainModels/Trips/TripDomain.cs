using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities.Trip;
using MongoDB.Bson;
using Gloobster.Enums;
using Gloobster.Common;
using Gloobster.DomainInterfaces.UserLogs;

namespace Gloobster.DomainModels.Services.Trip
{
    public class TripDomain : ITripDomain
    {
        public IDbOperations DB { get; set; }
        public IFilesDomain FileDomain { get; set; }
        public ITripPermissionsDomain Perms { get; set; }
        public ITripUserLog UserLog { get; set; }

        public async Task<bool> DeleteTripAsync(string tripId, string userId)
        {
            Perms.IsOwner(tripId, userId, true);
            
            var tripPhotoFilesDir = FileDomain.Storage.Combine(TripFileConstants.FileLocation, tripId);
            FileDomain.DeleteFolder(tripPhotoFilesDir);            

            var tripFilesDir = FileDomain.Storage.Combine(TripFileConstants.TripFilesDir, tripId);
            FileDomain.DeleteFolder(tripFilesDir);

            var tripIdObj = new ObjectId(tripId);            
            await DB.DeleteAsync<TripEntity>(tripIdObj);

            UserLog.Change(userId, tripId);

            return true;
        }

        public async Task<string> CreateNewTrip(string name, string userId, bool isInitial)
        {
            var userIdObj = new ObjectId(userId);

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

            var tripId = tripEntity.id.ToString();

            if (!isInitial)
            {
                UserLog.Change(userId, tripId);
            }

            return tripId;
        }
        
    }
}
