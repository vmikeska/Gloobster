using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class GeoNamesSearchProvider : ISearchProvider
	{
		public IGeoNamesService Service { get; set; }
		public bool CanBeUsed => true;
		public PortalUserDO PortalUser { get; set; }

		public async Task<List<Place>> SearchAsync(string query, LatLng coordinates = null)
		{
			var geoNamesResult = await Service.GetCityQueryAsync(query, 20);
			List<GeoName> gnPlaces = geoNamesResult.GeoNames;
			List<Place> places = gnPlaces.Select(Convert).ToList();
			return places;
		}


		private Place Convert(GeoName originalPlace)
		{
			var place = new Place
			{
				SourceType = SourceType.GN,
				SourceId = originalPlace.GeonameId.ToString(),
				Name = originalPlace.Name,
				City = originalPlace.Name,
				CountryCode = originalPlace.CountryCode,
				Coordinates = new LatLng { Lat = originalPlace.Latitude, Lng = originalPlace.Longitude }
			};
			return place;
		}
	}
}