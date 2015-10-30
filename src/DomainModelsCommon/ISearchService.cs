using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ISearchService
	{		
		Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj);		
	}
}