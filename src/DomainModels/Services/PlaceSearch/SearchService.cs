using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class SearchService
	{
		public PortalUserDO PortalUser { get; set; }

		public List<ISearchProvider> SearchProviders { get; set; }

		public async Task<List<Place>> SearchAsync(string query, LatLng coordinates = null)
		{
			var places = new List<Place>();
			foreach (var provider in SearchProviders)
			{
				provider.PortalUser = PortalUser;

				if (!provider.CanBeUsed)
				{
					continue;
				}

				List<Place> foundPlaces = await provider.SearchAsync(query, coordinates);
				places.AddRange(foundPlaces);
			}

			return places;
		}

	}
}