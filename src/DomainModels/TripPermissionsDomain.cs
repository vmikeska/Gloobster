using System;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities.Trip;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
    public class TripPermissionsDomain: ITripPermissionsDomain
    {
        public IDbOperations DB { get; set; }
        
        public bool HasEditPermissions(string tripId, string userId, bool throwEx = false)
        {        
            var tripIdObj = new ObjectId(tripId);
            var userIdObj = new ObjectId(userId);
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

            bool isOwner = trip.User_id == userIdObj;
            if (isOwner)
            {
                return true;
            }

            var thisUserParticipant = trip.Participants.FirstOrDefault(p => p.User_id == userIdObj);
            bool thisUserIsAdmin = (thisUserParticipant != null) && thisUserParticipant.IsAdmin;

            if (!thisUserIsAdmin && throwEx)
            {
                ThrowAuthException();
            }

            return thisUserIsAdmin;
        }

        public bool IsOwner(string tripId, string userId, bool throwEx = false)
        {
            var tripIdObj = new ObjectId(tripId);
            var userIdObj = new ObjectId(userId);
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

            bool isOwner = trip.User_id == userIdObj;

            if (!isOwner && throwEx)
            {
                ThrowAuthException();
            }

            return isOwner;
        }

        public void ThrowAuthException()
        {
            throw new TripAuthException();
        }
    }

    public class TripAuthException : Exception
    {
        
    }
}