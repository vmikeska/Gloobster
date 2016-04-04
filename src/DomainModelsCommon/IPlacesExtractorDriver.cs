using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IPlacesExtractorDriver
	{
		PlacesExtractionResults ExtractVisitedPlaces(string dbUserId, SocAuthDO auth);
	}
}