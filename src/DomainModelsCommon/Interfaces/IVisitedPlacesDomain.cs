using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IVisitedPlacesDomain
	{
		List<VisitedPlaceDO> GetPlacesOfMyFriendsByUserId(string userId);
        Task<List<VisitedPlaceDO>> AddNewPlacesAsync(List<VisitedPlaceDO> inputPlaces, string userId);
		Task<List<VisitedPlaceDO>> GetPlacesByUserIdAsync(string userId);
	}
}