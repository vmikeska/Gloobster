using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.BaseClasses;
using Gloobster.Enums;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class GeoNamesSearchProvider : ISearchProvider
	{
		public IGeoNamesService Service { get; set; }
		public bool CanBeUsed(SearchServiceQueryDO queryObj)
		{
			return true;
		}
		
		public async Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj)
		{
			var geoNamesResult = await Service.GetCityQueryAsync(queryObj.Query, queryObj.LimitPerProvider);
			var gnPlaces = geoNamesResult;
			List<Place> places = gnPlaces.Select(Convert).ToList();
			return places;
		}


		private Place Convert(CityDO originalPlace)
		{
			var place = new Place
			{
				SourceType = SourceType.City,
				SourceId = originalPlace.GID.ToString(),
				Name = originalPlace.Name,
				City = originalPlace.Name,
				CountryCode = originalPlace.CountryCode,
				Coordinates = originalPlace.Coordinates
			};
			return place;
		}
	}
}