using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public interface ISearchProvider
	{
		bool CanBeUsed { get; }

		PortalUserDO PortalUser { get; set; }
		Task<List<Place>> SearchAsync(string query, LatLng coordinates = null);
	}
}