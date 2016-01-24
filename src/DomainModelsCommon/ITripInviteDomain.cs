using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
	public interface ITripInviteDomain
	{
        void InvitePaticipants(List<string> ids, string userId, string tripId);
		Task<bool> UpdateInvitationState(string tripId, string userId, ParticipantState newState);
	    Task<bool> RemoveParticipant(string tripId, string id);
	    Task<bool> UpdateParticipantAdmin(string tripId, string id, bool isAdmin);

	}
}