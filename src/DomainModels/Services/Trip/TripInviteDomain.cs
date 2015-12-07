using System;
using System.Collections.Generic;
using System.Linq;
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
		
		public async void InvitePaticipants(List<ParticipantDO> newParticipants, string tripId)
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

					//todo: add notification
					//todo: send emails and such a stuff

				}
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