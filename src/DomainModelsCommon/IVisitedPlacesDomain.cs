using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IVisitedPlacesDomain
	{
        List<VisitedPlaceDO> GetPlacesByUsers(List<string> ids, string meId);
        Task<List<VisitedPlaceDO>> AddNewPlacesAsync(List<VisitedPlaceDO> inputPlaces, string userId);
	    List<VisitedPlaceDO> GetPlacesOverall();

	}
}