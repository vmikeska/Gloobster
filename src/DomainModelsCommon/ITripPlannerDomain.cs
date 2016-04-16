using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ITripPlannerDomain
	{
		void Initialize(string tripId, string userId);
		Task<AddPlaceResultDO> AddPlace(NewPlaceDO newPlace);
		Task<object> UpdateProperty(string propertyName, Dictionary<string, string> values);
	}

    public interface ITripPermissionsDomain
    {
        bool HasEditPermissions(string tripId, string userId, bool throwEx = false);
        bool IsOwner(string tripId, string userId, bool throwEx = false);
        void ThrowAuthException();
    }
}