using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ITripPlannerDomain
	{
		void Initialize(string tripId, string userId);
		AddPlaceResultDO AddPlace(NewPlaceDO newPlace);
		Task<object> UpdateProperty(string propertyName, Dictionary<string, string> values);
	}
}