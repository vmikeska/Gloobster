using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
	public interface ITripShareDomain
	{
        Task ShareTrip(ShareTripDO tripShare);
	}
}