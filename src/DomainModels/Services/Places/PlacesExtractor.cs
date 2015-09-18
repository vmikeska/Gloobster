using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;

namespace Gloobster.DomainModels.Services.Places
{
    public class PlacesExtractor: IPlacesExtractor
	{
		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }

		public IPlacesExtractorDriver Driver { get; set; }

		public IGeoNamesService GeoNamesService { get; set; }


		public List<VisitedPlaceDO> NewFoundUniquePlaces;
	    public List<VisitedCountryDO> NewFoundUniqueCountries;

	    public List<VisitedPlaceDO> NewVisitedPlaces;
	    public List<VisitedCountryDO> NewVisitedCountries;

		public string DbUserId;

		public async Task<bool> ExtractNewAsync(string dbUserId, object auth)
		{
			DbUserId = dbUserId;

			var newFoundPlaces = Driver.ExtractNewVisitedPlaces(dbUserId, auth);

			NewFoundUniquePlaces = PlacesDistinct(newFoundPlaces);

			var placesWithoutCoordinates = new List<VisitedPlaceDO>();
			foreach (VisitedPlaceDO place in NewFoundUniquePlaces)
			{
				bool hasNoCoordinates = place.PlaceLatitude == 0 && place.PlaceLongitude == 0;
				if (hasNoCoordinates)
				{
					bool foundCoordinates = await AddLatLongAsync(place);
					if (!foundCoordinates)
					{
						placesWithoutCoordinates.Add(place);
					}
				}
			}
			placesWithoutCoordinates.ForEach(p => NewFoundUniquePlaces.Remove(p));
            
			var newFoundUniqueCountries = NewFoundUniquePlaces.Select(p => p.CountryCode).Distinct().ToList();
			NewFoundUniqueCountries = newFoundUniqueCountries.Select(c => new VisitedCountryDO { CountryCode2 = c }).ToList();
			return true;
		}

	    private async Task<bool> AddLatLongAsync(VisitedPlaceDO place)
        {
		    var foundCities = await GeoNamesService.GetCityAsync(place.City, place.CountryCode, 1);
		    if (!foundCities.GeoNames.Any())
		    {
			    return false;
		    }
		    var foundCity = foundCities.GeoNames.First();

		    place.PlaceLatitude = double.Parse(foundCity.Latitude, CultureInfo.InvariantCulture);
		    place.PlaceLongitude = double.Parse(foundCity.Longitude, CultureInfo.InvariantCulture);
		    return true;
        }

	    public async void SaveAsync()
	    {
			NewVisitedPlaces = await VisitedPlaces.AddNewPlaces(NewFoundUniquePlaces, DbUserId);


			NewVisitedCountries = await VisitedCountries.AddNewCountries(NewFoundUniqueCountries, DbUserId);
		}

	    private List<VisitedPlaceDO> PlacesDistinct(List<VisitedPlaceDO> input)
		{
			var output = new List<VisitedPlaceDO>();
			foreach (var place in input)
			{
				if (!output.Contains(place))
				{
					output.Add(place);
				}
			}

			return output;
		}
	}
}
