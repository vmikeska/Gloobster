using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ITripPlannerDomain
	{
		void Initialize(string tripId, string userId);
		AddPlaceResultDO AddPlace(NewPlaceDO newPlace);
		//void AddInitialData();
	}
}