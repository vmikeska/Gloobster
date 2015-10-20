using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IVisitedCountriesDomain
	{
		List<VisitedCountryDO> GetCountriesOfMyFriendsByUserId(string userId);
        Task<List<VisitedCountryDO>> AddNewCountriesAsync(List<VisitedCountryDO> inputCountries, string userId);
		Task<List<VisitedCountryDO>> GetVisitedCountriesByUserIdAsync(string userId);
	}
}