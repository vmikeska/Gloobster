using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IVisitedCountriesDomain
	{
		List<VisitedCountryDO> GetCountriesOfMyFriendsByUserId(string userId);
        Task<List<VisitedCountryDO>> AddNewCountriesAsync(List<VisitedCountryDO> inputCountries, string userId);
		List<VisitedCountryDO> GetVisitedCountriesByUserId(string userId);
	}
}