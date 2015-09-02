using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IVisitedPlacesDomain
	{
		Task<List<VisitedPlaceDO>> AddNewPlaces(List<VisitedPlaceDO> inputPlaces, string userId);
		Task<List<VisitedPlaceDO>> GetPlacesByUserId(string userId);
	}
}