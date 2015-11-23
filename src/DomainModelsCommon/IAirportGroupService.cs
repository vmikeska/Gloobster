using System.Collections.Generic;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IAirportGroupService
	{
		List<AirportGroupDO> GetCitiesInRange(RectDO rectDO, int? minPopulation);
	}
}