using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class CountrySearchProvider : ISearchProvider
	{
		public ICountryService Service { get; set; }
		
		public bool CanBeUsed(SearchServiceQueryDO queryObj)
		{
			return true;
		}
		
		public async Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj)
		{
			var query = queryObj.Query.ToLower();

			var result = Service.CountriesList.Where(c => c.CountryName.ToLower().Contains(query));
            var resultPlaces = result.Select(c => new Place
			{
				Name = c.CountryName,
				CountryCode = c.CountryCode,
				SourceId = c.CountryCode,
				SourceType = SourceType.Country
			})
			.Take(queryObj.LimitPerProvider)
			.ToList();

			return resultPlaces;
		}
	}
}