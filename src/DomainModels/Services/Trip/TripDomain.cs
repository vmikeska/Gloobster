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
    }
}
