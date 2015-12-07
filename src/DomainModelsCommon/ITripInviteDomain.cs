using System.Collections.Generic;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
	public interface ITripInviteDomain
	{
		void InvitePaticipants(List<ParticipantDO> newParticipants, string tripId);
	}
}