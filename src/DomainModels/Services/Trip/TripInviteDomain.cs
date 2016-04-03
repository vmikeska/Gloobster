using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Sharing;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Trip
{
	public class TripInviteDomain: ITripInviteDomain
	{
		public IDbOperations DB { get; set; }
		public INotificationsDomain Notifications { get; set; }

	    public async Task<bool> UpdateParticipantAdmin(string tripId, string id, bool isAdmin)
	    {
            var tripIdObj = new ObjectId(tripId);
            var userIdObj = new ObjectId(id);
            var filter = DB.F<TripEntity>().Eq(t => t.id, tripIdObj)
                         & DB.F<TripEntity>().Eq("Participants.PortalUser_id", userIdObj);

            var update = DB.U<TripEntity>().Set("Participants.$.IsAdmin", isAdmin);
            var res = await DB.UpdateAsync(filter, update);
            return res.ModifiedCount == 1;
        }

		public async Task<bool> UpdateInvitationState(string tripId, string userId, ParticipantState newState)
		{
			var tripIdObj = new ObjectId(tripId);
			var userIdObj = new ObjectId(userId);
			var filter = DB.F<TripEntity>().Eq(t => t.id, tripIdObj)
			             & DB.F<TripEntity>().Eq("Participants.PortalUser_id", userIdObj);
			
			var update = DB.U<TripEntity>().Set("Participants.$.State", newState);
			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

	    public async Task<bool> RemoveParticipant(string tripId, string id)
	    {
            var tripIdObj = new ObjectId(tripId);
            var idObj = new ObjectId(id);
            var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

	        var participant = trip.Participants.FirstOrDefault(p => p.PortalUser_id == idObj);

            var filter = DB.F<TripEntity>().Eq(p => p.id, trip.id);
            var update = DB.U<TripEntity>().Pull(p => p.Participants, participant);
            var res = await DB.UpdateAsync(filter, update);
	        return res.ModifiedCount == 1;
	    }


		public async void InvitePaticipants(List<string> ids, string userId, string tripId)
		{
			var tripIdObj = new ObjectId(tripId);
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				throw new Exception();
			}

			foreach (string id in ids)
			{
				bool alreadyParicipating = ContainsParticipant(id, trip);
				if (!alreadyParicipating)
				{
					var filter = DB.F<TripEntity>().Eq(p => p.id, trip.id);
				    var newPartEntity = new ParticipantSE
				    {
				        IsAdmin = false,
				        PortalUser_id = new ObjectId(id),
				        State = ParticipantState.Invited
				    };
                      
					var update = DB.U<TripEntity>().Push(p => p.Participants, newPartEntity);
					await DB.UpdateAsync(filter, update);
					
					//todo: send emails and such a stuff

				}

				var notifMsg = await Notifications.Messages.TripInvitation(userId, id, tripId);
				Notifications.AddNotification(notifMsg);
			}
		}

		private bool ContainsParticipant(string userId, TripEntity trip)
		{
			if (trip.Participants == null)
			{
				return false;
			}

			return trip.Participants.Any(p => p.PortalUser_id.ToString() == userId);
		}

		
	}
}