using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IVisitedCountriesDomain
	{
		Task<List<VisitedCountryDO>> AddNewCountries(List<VisitedCountryDO> inputCountries, string userId);
		Task<List<VisitedCountryDO>> GetVisitedCountriesByUserId(string userId);
	}
}