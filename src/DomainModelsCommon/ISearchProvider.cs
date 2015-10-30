using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ISearchProvider
	{
		bool CanBeUsed(SearchServiceQueryDO queryObj);
		Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj);
	}
}