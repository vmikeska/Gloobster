using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IVisitedCitiesDomain
	{
		List<VisitedCityDO> GetCitiesOfMyFriendsByUserId(string userId);
        Task<List<VisitedCityDO>> AddNewCitiesAsync(List<VisitedCityDO> inputCities, string userId);
		List<VisitedCityDO> GetCitiesByUserId(string userId);
	}
}