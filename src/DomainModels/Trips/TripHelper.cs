using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Mappers;
using Gloobster.ReqRes.Trip;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Trips
{
	public class TripUtils
	{
        public static List<TripUsersResponse> GetUsers(List<ObjectId> ids, IDbOperations db)
        {
			var commentsUsers = db.List<UserEntity>(u => ids.Contains(u.User_id)).ToList();
			var commentsUsersResponse = commentsUsers.Select(u => u.ToResponse()).ToList();
			return commentsUsersResponse;
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