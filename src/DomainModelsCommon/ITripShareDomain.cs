using System.Collections.Generic;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
	public interface ITripShareDomain
	{
		void ShareTrip(ShareTripDO tripShare);
	}
}