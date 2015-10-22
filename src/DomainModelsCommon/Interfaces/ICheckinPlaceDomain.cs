using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface ICheckinPlaceDomain
	{
		Task<AddedPlacesResultDO> CheckinPlace(string sourceId, SourceType sourceType, string userId);
	}
}