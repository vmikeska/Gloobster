using System.Collections.Generic;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModels.Services.Places
{
	public interface IPlacesExtractorDriver
	{
		List<VisitedPlaceDO> ExtractNewVisitedPlaces(string dbUserId, object auth);
	}
}