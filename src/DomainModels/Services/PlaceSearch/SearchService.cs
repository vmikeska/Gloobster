using System.Collections.Generic;
using System.Threading.Tasks;
using Autofac;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class SearchService: ISearchService
	{		

		private SourceType[] DefaultProviders = { SourceType.FB, SourceType.GN, SourceType.S4 };

		public List<ISearchProvider> SearchProviders = new List<ISearchProvider>();

		public IComponentContext ComponentContext { get; set; }
		
		public SearchService(IComponentContext componentContext)
		{
			ComponentContext = componentContext;

			foreach (SourceType providerType in DefaultProviders)
			{
				var providerInstance = ComponentContext.ResolveKeyed<ISearchProvider>(providerType);
				SearchProviders.Add(providerInstance);
			}
		}


		public async Task<List<Place>> SearchAsync(SearchServiceQuery queryObj)
		{
			//todo: custom providers

			var places = new List<Place>();
			foreach (var provider in SearchProviders)
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