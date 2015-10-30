using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.BaseClasses;

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
			List<GeoName> gnPlaces = geoNamesResult.GeoNames;
			List<Place> places = gnPlaces.Select(Convert).ToList();
			return places;
		}


		private Place Convert(GeoName originalPlace)
		{
			var place = new Place
			{
				SourceType = SourceType.City,
				SourceId = originalPlace.GeonameId.ToString(),
				Name = originalPlace.Name,
				City = originalPlace.Name,
				CountryCode = originalPlace.CountryCode,
				Coordinates = new LatLng
				{
					Lat = originalPlace.Latitude,
					Lng = originalPlace.Longitude
				}
			};
			return place;
		}
	}
}