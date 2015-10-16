using System.Collections.Generic;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IPlacesExtractorDriver
	{
		PlacesExtractionResults ExtractVisitedPlaces(string dbUserId, SocAuthenticationDO auth);
	}
}