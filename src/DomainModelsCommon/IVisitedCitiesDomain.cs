using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IVisitedCitiesDomain
	{
	    List<VisitedCityDO> GetCitiesByUsers(List<string> ids, string meId);
        //Task<List<VisitedCityDO>> AddNewCitiesAsync(List<VisitedCityDO> inputCities, string userId);
	    List<VisitedCityDO> GetCitiesOverall();

	    Task<List<VisitedCityDO>> AddNewCitiesByGIDAsync(List<GidDateDO> gids, string userId);
	    Task<List<VisitedCityDO>> AddNewCitiesWithGidAsync(List<VisitedCityDO> inputCities, string userId);



	}
}