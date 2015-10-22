using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IVisitedCitiesDomain
	{
		List<VisitedCityDO> GetCitiesOfMyFriendsByUserId(string userId);
        Task<List<VisitedCityDO>> AddNewCitiesAsync(List<VisitedCityDO> inputCities, string userId);
		List<VisitedCityDO> GetCitiesByUserId(string userId);
	}
}