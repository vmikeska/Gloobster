using System.Collections.Generic;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ITripPlannerDomain
	{
		void Initialize(string tripId, string userId);
		AddPlaceResultDO AddPlace(NewPlaceDO newPlace);
		void UpdateProperty(string propertyName, Dictionary<string, string> values);
	}
}