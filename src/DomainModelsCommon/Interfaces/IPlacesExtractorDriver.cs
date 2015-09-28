using System.Collections.Generic;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IPlacesExtractorDriver
	{
		List<VisitedPlaceDO> ExtractNewVisitedPlaces(string dbUserId, SocAuthenticationDO auth);
	}
}