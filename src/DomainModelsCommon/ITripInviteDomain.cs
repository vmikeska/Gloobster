using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
	public interface ITripInviteDomain
	{
		void InvitePaticipants(List<ParticipantDO> newParticipants, string id, string tripId);
		Task<bool> UpdateInvitationState(string tripId, string userId, ParticipantState newState);
	}
}