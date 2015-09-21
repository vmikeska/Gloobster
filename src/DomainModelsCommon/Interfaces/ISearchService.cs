using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface ISearchService
	{		
		Task<List<Place>> SearchAsync(SearchServiceQuery queryObj);		
	}
}