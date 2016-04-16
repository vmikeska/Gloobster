using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Microsoft.AspNet.WebUtilities;
using Serilog;

namespace Gloobster.DomainModels.Services.Places
{
    public class PlacesExtractor: IPlacesExtractor
	{
        public ILogger Log { get; set; }

		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCitiesDomain VisitedCities { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }
        public IVisitedStatesDomain VisitedStates { get; set; }

		public IPlacesExtractorDriver Driver { get; set; }

		public IGeoNamesService GeoNamesService { get; set; }

        public List<VisitedCityDO> NewFoundUniqueCities = new List<VisitedCityDO>();
        public List<VisitedCityDO> NewFoundUniqueCitiesWithGID = new List<VisitedCityDO>();

        public List<VisitedPlaceDO> NewFoundUniquePlaces = new List<VisitedPlaceDO>();		
	    public List<VisitedCountryDO> NewFoundUniqueCountries = new List<VisitedCountryDO>();
        public List<VisitedStateDO> NewFoundUniqueStates = new List<VisitedStateDO>();

        public List<VisitedPlaceDO> NewVisitedPlaces = new List<VisitedPlaceDO>();
		public List<VisitedCityDO> NewVisitedCities = new List<VisitedCityDO>();
	    public List<VisitedCountryDO> NewVisitedCountries = new List<VisitedCountryDO>();
        public List<VisitedStateDO> NewVisitedStates = new List<VisitedStateDO>();

        public string DbUserId;

		public async Task<bool> ExtractNewAsync(string dbUserId, SocAuthDO auth)
		{            
            DbUserId = dbUserId;
			
			PlacesExtractionResults extractedPlaces = Driver.ExtractVisitedPlaces(dbUserId, auth);
            
            await ExtractPlaces(extractedPlaces);
            
            ExtractCities(extractedPlaces);
            
            ExtractCountries(extractedPlaces);
            
            return true;
		}

        public void ExtractCountries(PlacesExtractionResults extractedPlaces)
        {
            try
            {
                if (extractedPlaces.VisitedCountries != null)
                {
                    var newCountries = extractedPlaces.VisitedCountries.Where(c => !NewFoundUniqueCountries.Contains(c));
                    NewFoundUniqueCountries.AddRange(newCountries);
                }
            }
            catch (Exception exc)
            {
                Log.Error($"PlacesExtractor: ExtractCountries: {exc.Message}");
            }
        }

        public void ExtractCities(PlacesExtractionResults extractedPlaces)
        {
            try
            {
                if (extractedPlaces.VisitedCities != null)
                {
                    var newCities = extractedPlaces.VisitedCities.Where(c => !NewFoundUniqueCities.Contains(c)).ToList();
                    NewFoundUniqueCities.AddRange(newCities);

                    var newCountries = GetUniqueCountries(newCities);
                    var newUniqueCountries = newCountries.Where(c => !NewFoundUniqueCountries.Contains(c));
                    NewFoundUniqueCountries.AddRange(newUniqueCountries);

                    var usCities = NewFoundUniqueCitiesWithGID.Where(c => c.CountryCode == "US").ToList();
                    NewFoundUniqueStates = GetUniqueStates(usCities);
                }
            }
            catch (Exception exc)
            {
                Log.Error($"PlacesExtractor: ExtractCities: {exc.Message}");
            }
        }

        public async Task ExtractPlaces(PlacesExtractionResults extractedPlaces)
        {
            try
            {
                if (extractedPlaces.VisitedPlaces != null)
                {
                    var newFoundUniquePlaces = GetUniquePlaces(extractedPlaces.VisitedPlaces);
                    NewFoundUniquePlaces = await GetPlacesWithFixedLocations(newFoundUniquePlaces);

                    NewFoundUniqueCities = GetUniqueCities(NewFoundUniquePlaces);
                    NewFoundUniqueCitiesWithGID = await GetCitiesWithGid(NewFoundUniqueCities);

                    NewFoundUniqueCountries = GetUniqueCountries(NewFoundUniqueCities);

                    var usCities = NewFoundUniqueCitiesWithGID.Where(c => c.CountryCode == "US").ToList();
                    NewFoundUniqueStates = GetUniqueStates(usCities);
                }
            }
            catch (Exception exc)
            {
                Log.Error($"PlacesExtractor: ExtractPlaces: {exc.Message}");
            }
        }

        public async Task<bool> SaveAsync()
        {
            try
            {
                NewVisitedPlaces = await VisitedPlaces.AddNewPlacesAsync(NewFoundUniquePlaces, DbUserId);

                NewVisitedCities = await VisitedCities.AddNewCitiesWithGidAsync(NewFoundUniqueCitiesWithGID, DbUserId);

                NewVisitedCountries = await VisitedCountries.AddNewCountriesAsync(NewFoundUniqueCountries, DbUserId);

                NewVisitedStates = await VisitedStates.AddNewStatesAsync(NewFoundUniqueStates, DbUserId);

                return true;
            }
            catch (Exception exc)
            {
                Log.Error($"PlacesExtractor: SaveAsync: {exc.Message}");
                throw;
            }
        }

        private async Task<List<VisitedCityDO>> GetCitiesWithGid(List<VisitedCityDO> cities)
        {
            var res = new List<VisitedCityDO>();
            foreach (var city in cities)
            {
                var c = await TryIdentifyCity(city.CountryCode, city.City, city.Dates);
                if (c != null)
                {
                    res.Add(c);
                }
            }
            return res;
        }

        private async Task<VisitedCityDO> TryIdentifyCity(string countryCode, string city, List<DateTime> dates)
        {
            var gnCities = await GeoNamesService.GetCityAsync(city, countryCode, 1);
            var gnCity = gnCities.FirstOrDefault();
            if (gnCity == null)
            {
                return null;
            }

            var cityDo = new VisitedCityDO
            {
                City = gnCity.Name,
                CountryCode = gnCity.CountryCode,
                GeoNamesId = gnCity.GID,
                Location = gnCity.Coordinates,
                UsState = gnCity.UsState,
                Dates = dates,
                Count = dates.Count
            };

            return cityDo;
        } 



        private async Task<LatLng> GetLatLongAsync(string city, string countryCode)
        {
		    var foundCities = await GeoNamesService.GetCityAsync(city, countryCode, 1);
		    if (!foundCities.Any())
		    {
			    return null;
		    }

		    var foundCity = foundCities.First();
		    return foundCity.Coordinates;		    
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

        private List<VisitedStateDO> GetUniqueStates(List<VisitedCityDO> inputCities)
        {
            var groupedCities = inputCities.GroupBy(g => g.UsState).ToList();

            var states = new List<VisitedStateDO>();
            foreach (var groupedCity in groupedCities)
            {
                List<DateTime> allDates = groupedCity.SelectMany(g => g.Dates).ToList();
                var state = new VisitedStateDO
                {
                    Dates = allDates,
                    StateCode = groupedCity.First().UsState,
                    PortalUserId = DbUserId
                };

                states.Add(state);
            }

            return states;
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
