using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IPortalUserVisitedPlacesDomain
	{
		Task<List<VisitedPlaceDO>> AddNewPlaces(List<VisitedPlaceDO> inputPlaces, string userId);
	}
}