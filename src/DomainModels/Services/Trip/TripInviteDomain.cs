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


		public async void InvitePaticipants(List<ParticipantDO> newParticipants, string userId, string tripId)
		{
			var tripIdObj = new ObjectId(tripId);
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				throw new Exception();
			}

			foreach (var newParticipant in newParticipants)
			{
				bool alreadyParicipating = ContainsParticipant(newParticipant.UserId, trip);
				if (!alreadyParicipating)
				{
					var filter = DB.F<TripEntity>().Eq(p => p.id, trip.id);
					var newPartEntity = newParticipant.ToEntity();
					var update = DB.U<TripEntity>().Push(p => p.Participants, newPartEntity);
					await DB.UpdateAsync(filter, update);
					
					//todo: send emails and such a stuff

				}

				var notifMsg = Notifications.Messages.TripInvitation(userId, newParticipant.UserId, tripId);
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