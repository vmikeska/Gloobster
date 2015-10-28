using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface ISearchProvider
	{
		bool CanBeUsed(SearchServiceQueryDO queryObj);
		Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj);
	}
}