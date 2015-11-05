using System.Collections.Generic;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ITripShareDomain
	{
		void InvitePaticipants(List<ParticipantDO> newParticipants, string tripId);
	}
}