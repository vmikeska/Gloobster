using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Microsoft.AspNet.WebUtilities;

namespace Gloobster.DomainModels.Services.Places
{


    public class PlacesExtractor: IPlacesExtractor
	{
		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCitiesDomain VisitedCities { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }

		public IPlacesExtractorDriver Driver { get; set; }

		public IGeoNamesService GeoNamesService { get; set; }

	    public List<VisitedPlaceDO> NewFoundUniquePlaces = new List<VisitedPlaceDO>();
		public List<VisitedCityDO> NewFoundUniqueCities = new List<VisitedCityDO>();
	    public List<VisitedCountryDO> NewFoundUniqueCountries = new List<VisitedCountryDO>();

		public List<VisitedPlaceDO> NewVisitedPlaces = new List<VisitedPlaceDO>();
		public List<VisitedCityDO> NewVisitedCities = new List<VisitedCityDO>();
	    public List<VisitedCountryDO> NewVisitedCountries = new List<VisitedCountryDO>();
		
		public string DbUserId;

		public async Task<bool> ExtractNewAsync(string dbUserId, SocAuthenticationDO auth)
		{
			DbUserId = dbUserId;
			
			var extractedPlaces = Driver.ExtractVisitedPlaces(dbUserId, auth);

			if (extractedPlaces.VisitedPlaces != null)
			{
				var newFoundUniquePlaces = GetUniquePlaces(extractedPlaces.VisitedPlaces);
				NewFoundUniquePlaces = await GetPlacesWithFixedLocations(newFoundUniquePlaces);

				NewFoundUniqueCities = GetUniqueCities(NewFoundUniquePlaces);

				NewFoundUniqueCountries = GetUniqueCountries(NewFoundUniqueCities);
			}

			if (extractedPlaces.VisitedCities != null)
			{
				var newCities = extractedPlaces.VisitedCities.Where(c => !NewFoundUniqueCities.Contains(c)).ToList();
				NewFoundUniqueCities.AddRange(newCities);

				var newCountries = GetUniqueCountries(newCities);
				var newUniqueCountries = newCountries.Where(c => !NewFoundUniqueCountries.Contains(c));
				NewFoundUniqueCountries.AddRange(newUniqueCountries);
            }

			if (extractedPlaces.VisitedCountries != null)
			{
				var newCountries = extractedPlaces.VisitedCountries.Where(c => !NewFoundUniqueCountries.Contains(c));
				NewFoundUniqueCountries.AddRange(newCountries);
			}
			
			return true;
		}

	    private async Task<LatLng> GetLatLongAsync(string city, string countryCode)
        {
		    var foundCities = await GeoNamesService.GetCityAsync(city, countryCode, 1);
		    if (!foundCities.GeoNames.Any())
		    {
			    return null;
		    }

		    var foundCity = foundCities.GeoNames.First();			
		    return new LatLng {Lat = foundCity.Latitude, Lng = foundCity.Longitude};
        }
		
	    public async void SaveAsync()
	    {
			NewVisitedPlaces = await VisitedPlaces.AddNewPlaces(NewFoundUniquePlaces, DbUserId);

			NewVisitedCities = await VisitedCities.AddNewCities(NewFoundUniqueCities, DbUserId);
			
			NewVisitedCountries = await VisitedCountries.AddNewCountries(NewFoundUniqueCountries, DbUserId);
		}
		
	    private async Task<List<VisitedPlaceDO>> GetPlacesWithFixedLocations(List<VisitedPlaceDO> inputPlaces)
	    {
			var placesWithCoordinates = new List<VisitedPlaceDO>();
			foreach (var place in inputPlaces)
			{
				bool hasNoCoordinates = place.Location.Lat == 0 && place.Location.Lng == 0;
				if (hasNoCoordinates)
				{
					var newCoordinates = await GetLatLongAsync(place.City, place.CountryCode);
					bool foundCoordinates = newCoordinates != null;
					if (foundCoordinates)
					{
						place.Location = newCoordinates;
						placesWithCoordinates.Add(place);
					}
				}
				else
				{
					placesWithCoordinates.Add(place);
				}
			}

		    return placesWithCoordinates;
	    }

		private List<VisitedCountryDO> GetUniqueCountries(List<VisitedCityDO> inputCities)
	    {
			var groupedCountries = inputCities.GroupBy(g => g.CountryCode).ToList();

			var countries = new List<VisitedCountryDO>();
			foreach (var groupedCountry in groupedCountries)
			{
				List<DateTime> allDates = groupedCountry.SelectMany(g => g.Dates).ToList();				
				var country = new VisitedCountryDO
				{
					Dates = allDates,
					CountryCode2 = groupedCountry.First().CountryCode,
					PortalUserId = DbUserId
				};

				countries.Add(country);
			}

			return countries;
		}


	    private List<VisitedPlaceDO> GetUniquePlaces(List<VisitedPlaceDO> inputPlaces)
		{
			var output = new Dictionary<string, VisitedPlaceDO>();
			foreach (VisitedPlaceDO place in inputPlaces)
			{
				if (!output.ContainsKey(place.SourceId))
				{
					output.Add(place.SourceId, place);
				}
				else
				{
					output[place.SourceId].Dates.AddRange(place.Dates);
				}
			}

		    var uniquePlaces = output.Values.ToList();
            return uniquePlaces;
		}

		private List<VisitedCityDO> GetUniqueCities(List<VisitedPlaceDO> inputPlaces)
		{
			var groupedPlaces = inputPlaces.GroupBy(g => new {g.City, g.CountryCode}).ToList();

			var cities = new List<VisitedCityDO>();
			foreach (var groupedPlace in groupedPlaces)
			{
				List<DateTime> allDates = groupedPlace.SelectMany(g => g.Dates).ToList();
				var firstPlace = groupedPlace.First();
				firstPlace.Dates = allDates;
				var city = PlaceToCity(firstPlace);
				
				cities.Add(city);
			}
			
			return cities;
		}

	    private VisitedCityDO PlaceToCity(VisitedPlaceDO place)
	    {
		    var city = new VisitedCityDO
		    {
			    City = place.City,
			    CountryCode = place.CountryCode,
			    Location = place.Location,
			    PortalUserId = place.PortalUserId,
				Dates = place.Dates
		    };
		    return city;
	    }
	}
}
