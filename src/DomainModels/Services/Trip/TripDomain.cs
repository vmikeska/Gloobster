using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities.Trip;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Trip
{
    public class TripDomain : ITripDomain
    {
        public IDbOperations DB { get; set; }
        public IFilesDomain FileDomain { get; set; }
        public ITripPermissionsDomain Perms { get; set; }

        public async Task<bool> DeleteTripAsync(string tripId, string userId)
        {
            Perms.IsOwner(tripId, userId, true);
            
            var tripPhotoFilesDir = FileDomain.Storage.Combine(TripFileConstants.FileLocation, tripId);
            FileDomain.DeleteFolder(tripPhotoFilesDir);            

            var tripFilesDir = FileDomain.Storage.Combine(TripFileConstants.TripFilesDir, tripId);
            FileDomain.DeleteFolder(tripFilesDir);

            var tripIdObj = new ObjectId(tripId);            
            await DB.DeleteAsync<TripEntity>(tripIdObj);

            return true;
        }

        public static Tuple<DateTime, DateTime> GetTripFromTo(TripEntity trip)
        {
            var ordredPlaces = trip.Places.OrderBy(t => t.OrderNo);
            var firstPlace = ordredPlaces.First();
            var lastPlace = ordredPlaces.Last();
            var firstTravel = trip.Travels.FirstOrDefault(t => t.id == firstPlace.LeavingId);
            var lastTravel = trip.Travels.FirstOrDefault(t => t.id == lastPlace.ArrivingId);
            var fromDate = firstTravel.LeavingDateTime.Value;
            var toDate = lastTravel.ArrivingDateTime.Value;

            return new Tuple<DateTime, DateTime>(fromDate, toDate);
        }
    }
}
