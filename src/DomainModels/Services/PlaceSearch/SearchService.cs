using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class SearchService: ISearchService
	{

		private readonly SourceType[] _defaultProviders = { SourceType.FB, SourceType.City, SourceType.Country, SourceType.S4 };

		public Dictionary<SourceType, ISearchProvider> SearchProviders = new Dictionary<SourceType, ISearchProvider>();

		public IComponentContext ComponentContext { get; set; }
		
		public SearchService(IComponentContext componentContext)
		{
			ComponentContext = componentContext;			
			SetSearchProviders(_defaultProviders);
		}

		private void SetSearchProviders(SourceType[] providers)
		{
			foreach (SourceType providerType in providers)
			{
				var providerInstance = ComponentContext.ResolveKeyed<ISearchProvider>(providerType);
				SearchProviders.Add(providerType, providerInstance);
			}
		}
		
		public async Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj)
		{
			var searchProviders = SearchProviders.Where(p => queryObj.CustomProviders.Contains(p.Key)).Select(p => p.Value);
			
			queryObj.LimitPerProvider = 3;
			
			var places = new List<Place>();
			foreach (var provider in searchProviders)
			{
				bool canBeUsed = provider.CanBeUsed(queryObj);
				if (!canBeUsed)
				{
					continue;				
				}

				List<Place> foundPlaces = await provider.SearchAsync(queryObj);
				places.AddRange(foundPlaces);
			}

			return places;
		}

	}
}