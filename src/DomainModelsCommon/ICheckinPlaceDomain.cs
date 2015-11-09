using System.Threading.Tasks;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
	public interface ICheckinPlaceDomain
	{
		Task<AddedPlacesResultDO> CheckinPlace(string sourceId, SourceType sourceType, string userId);
	}
}