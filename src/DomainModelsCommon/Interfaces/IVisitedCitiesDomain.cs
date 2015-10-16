using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IVisitedCitiesDomain
	{
		Task<List<VisitedCityDO>> AddNewCities(List<VisitedCityDO> inputCities, string userId);
		Task<List<VisitedCityDO>> GetCitiesByUserId(string userId);
	}
}