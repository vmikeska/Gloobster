using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FourSquare.SharpSquare.Entities;
using Gloobster.Common;

using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class CheckinPlaceDomain: ICheckinPlaceDomain
	{
		public IGeoNamesService GNService { get; set; }
		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCitiesDomain VisitedCities { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }
		public ICountryService CountryService { get; set; }
		public IFacebookService FBService { get; set; }
		public IDbOperations DB { get; set; }
		public IFoursquareService Service { get; set; }

		public async Task<AddedPlacesResultDO> CheckinPlace(string sourceId, SourceType sourceType, string userId)
		{
			if (sourceType == SourceType.FB)
			{
				var result =  await AddFromFB(userId, sourceId);
				return result;
			}
			if (sourceType == SourceType.City)
			{
				var result = await AddFromCity(sourceId, userId);
				return result;
			}
			if (sourceType == SourceType.Country)
			{
				var countries = await AddCountry(sourceId, userId);
				var result = new AddedPlacesResultDO {Countries = countries};
				return result;				
			}
			if (sourceType == SourceType.S4)
			{
				var result = await AddFromFoursquare(sourceId, userId);
				return result;
			}

			return null;
		}

		private async Task<AddedPlacesResultDO> AddFromCity(string sourceId, string userId)
		{
			var result = new AddedPlacesResultDO();

			long id = long.Parse(sourceId);
			result.Cities = await AddCity(id, userId);
			var city = result.Cities.FirstOrDefault();

			if (city != null)
			{
				result.Countries = await AddCountry(city.CountryCode, userId);
			}

			return result;
		}

		private async Task<AddedPlacesResultDO> AddFromFoursquare(string venueId, string userId)
		{
			Venue venue = Service.Client.GetVenue(venueId);

			var location = venue.location;
			if (location == null)
			{
				return null;
			}

			var latLng = new LatLng {Lat = location.lat, Lng = location.lng};
			var result = await AddPlace(userId, venueId, SourceTypeDO.S4, venue.location.city, venue.location.cc, latLng);
			return result;
		}

		//private async void AddFromFB(string userId, string sourceId)
		//{
		//	var userIdObj = new ObjectId(userId);
		//	var user = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);
		//	var fbAuth = user.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Facebook);

		//	FBService.SetAccessToken(fbAuth.Authentication.AccessToken);
		//	var fbPlace = FBService.Get<PlaceFO>(sourceId);

		//	var location = fbPlace.Location;
		//	if (location != null)
		//	{
		//		var country = CountryService.GetByCountryName(fbPlace.Location.Country);

		//		bool hasCoordinates = location.Latitude != 0 && location.Longitude != 0;
		//		if (hasCoordinates)
		//		{
		//			var places = new List<VisitedPlaceDO> { new VisitedPlaceDO
		//				{
		//					City = location.City,
		//					CountryCode = country.CountryCode,
		//					SourceId = sourceId,
		//					PortalUserId = userId,
		//					SourceType = SourceTypeDO.Facebook,
		//					Location = new LatLng {Lat = location.Latitude, Lng = location.Longitude}
		//				}};

		//			await VisitedPlaces.AddNewPlacesAsync(places, userId);
		//		}

		//		if (country != null)
		//		{
		//			var gnCities = await GNService.GetCityAsync(fbPlace.Location.City, country.CountryCode, 1);
		//			if (gnCities.GeoNames.Any())
		//			{
		//				var gnCity = gnCities.GeoNames.First();
		//				await AddCity(gnCity.GeonameId, userId);
		//			}

		//			AddCountry(country.CountryCode, userId);
		//		}
		//	}
		//}

		private async Task<AddedPlacesResultDO> AddFromFB(string userId, string sourceId)
		{
			var userIdObj = new ObjectId(userId);
			var user = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);
			var fbAuth = user.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Facebook);

			FBService.SetAccessToken(fbAuth.Authentication.AccessToken);
			var fbPlace = FBService.Get<PlaceFO>(sourceId);

			var location = fbPlace.Location;
			if (location == null)
			{
				return null;
			}

			var latLng = new LatLng {Lat = location.Latitude, Lng = location.Longitude};
			var country = CountryService.GetByCountryName(fbPlace.Location.Country);
			var result = await AddPlace(userId, sourceId, SourceTypeDO.FB, fbPlace.Location.City, country.CountryCode, latLng);
			return result;			
		}

		private async Task<AddedPlacesResultDO> AddPlace(string userId, string sourceId, SourceTypeDO sourceType, string city, string countryCode, LatLng latLng)
		{
			var result = new AddedPlacesResultDO();

			bool hasCoordinates = latLng.Lat != 0 && latLng.Lng != 0;
			if (hasCoordinates)
			{
				var places = new List<VisitedPlaceDO>
				{
					new VisitedPlaceDO
					{
						City = city,
						CountryCode = countryCode,
						SourceId = sourceId,
						PortalUserId = userId,
						SourceType = sourceType,
						Location = latLng,
						Dates = new List<DateTime> {DateTime.UtcNow }
					}
				};

				result.Places = await VisitedPlaces.AddNewPlacesAsync(places, userId);				
			}
			
			var gnCities = await GNService.GetCityAsync(city, countryCode, 1);
			if (gnCities.GeoNames.Any())
			{
				var gnCity = gnCities.GeoNames.First();
				result.Cities = await AddCity(gnCity.GeonameId, userId);
			}

			result.Countries = await AddCountry(countryCode, userId);

			return result;
		}

		private async Task<List<VisitedCityDO>> AddCity(long gnId, string userId)
		{			
			var city = await GNService.GetCityByIdAsync(gnId);
			var cityDO = new VisitedCityDO
			{
				GeoNamesId = city.GeonameId,
				PortalUserId = userId,
				Dates = new List<DateTime> { DateTime.UtcNow}
			};

			var cities = new List<VisitedCityDO> { cityDO };
			var addedCities = await VisitedCities.AddNewCitiesAsync(cities, userId);

			return addedCities;
		}

		private async Task<List<VisitedCountryDO>> AddCountry(string countryCode, string userId)
		{
			var country = CountryService.GetCountryByCountryCode2(countryCode);
			bool countryExists = country != null;
			if (countryExists)
			{
				var countries = new List<VisitedCountryDO>
				{
					new VisitedCountryDO {CountryCode2 = countryCode, PortalUserId = userId, Dates = new List<DateTime> { DateTime.UtcNow}}
				};
				var addedCountries = await VisitedCountries.AddNewCountriesAsync(countries, userId);				
				return addedCountries;
			}

			return null;
		}
	}
}