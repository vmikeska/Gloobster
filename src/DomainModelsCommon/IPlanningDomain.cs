using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IPlanningDomain
	{
		Task<bool> ChangeCountrySelection(CountrySelectionDO selection);
		Task<bool> ChangeCitySelection(CitySelectionDO selection);

		Task<bool> ChangeWeekendExtraDaysLength(string userId, int daysLength);
        void CreateDBStructure(string userId);

		Task<bool> UpdateCustomProperty(string userId, string searchId, string propName, object value);
		Task<bool> PushCustomProperty(string userId, string searchId, string propName, object value);
	}
}
