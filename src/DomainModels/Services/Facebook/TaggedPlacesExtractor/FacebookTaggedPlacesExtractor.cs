using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor
{
	public class FacebookTaggedPlacesExtractor: IFacebookTaggedPlacesExtractor
	{
		public string AccessToken;
		public string UserId;
		public IFacebookService FBService { get; set; }
		public ICountryService CountryService { get; set; }
		public IGeoNamesService GeoNamesService { get; set; }

		private const string UserQueryBase = "/{0}/tagged_places";
		private const string UserQueryNext = UserQueryBase + "/?after={1}";

		public List<FoundPlace> ExtractedPlaces { get; set; }
		public List<FoundPlace> UniquePlaces { get; set; }
		public List<string> UniqueCountries { get; set; }


		//public FacebookTaggedPlacesExtractor(IFacebookService fbService, ICountryService countryService, IGeoNamesService geoNamesService)
		//{
		//	FBService = fbService;
		//	CountryService = countryService;
		//	GeoNamesService = geoNamesService;
		//}

		public void SetUserData(string accessToken, string userId)
		{
			AccessToken = accessToken;
			UserId = userId;
		}

		public void ExtractAll()
		{
			var taggedPlacesQuery = string.Format(UserQueryBase, UserId);

			FBService.SetAccessToken(AccessToken);

			ExtractedPlaces = new List<FoundPlace>();			
			Extract(taggedPlacesQuery, ExtractedPlaces);

			ExtractedPlaces.ForEach(i =>
			{
				i.CountryCode2 = CountryService.GetByCountryName(i.Country).CountryCode;
				i.CountryCode3 = CountryService.GetByCountryName(i.Country).IsoAlpha3;
			});
			
			UniquePlaces = PlacesDistinct(ExtractedPlaces);

			//AddLatLong();			`

			UniqueCountries = UniquePlaces.Select(p => p.Country).Distinct().ToList();
		}

		//private async void AddLatLong()
		//{
		//	foreach (var place in UniquePlaces)
		//	{
		//		var foundCities = await GeoNamesService.GetCityAsync(place.City, place.CountryCode2, 1);
		//		if (!foundCities.GeoNames.Any())
		//		{
		//			continue;
		//		}
		//		var foundCity = foundCities.GeoNames.First();

		//		place.Latitude = foundCity.Latitude;
		//		place.Longitude = foundCity.Longitude;
		//	}			
  //      }

		private List<FoundPlace> PlacesDistinct(List<FoundPlace> input)
		{
			var output = new List<FoundPlace>();
			foreach (var place in input)
			{
				if (!output.Contains(place))
				{
					output.Add(place);
				}
			}

			return output;
		}
		
		private void Extract(string query, List<FoundPlace> foundPlaces)
		{
			var response = FBService.Get<TaggedPlacesFO>(query);

			var currentFoundPlaces = response.Data.Where(c => c.Place.Location.Country != null).Select(i => new FoundPlace
			{
				City = i.Place.Location.City,
				Country = i.Place.Location.Country,
				CheckinId = i.Id,
				Time = DateTime.Parse(i.CreatedTime),
				Latitude = i.Place.Location.Latitude,
				Longitude = i.Place.Location.Longitude,
			});
			foundPlaces.AddRange(currentFoundPlaces);

			if (response.Paging != null)
			{
				var nextQuery = string.Format(UserQueryNext, UserId, response.Paging.Cursors.After);
				Extract(nextQuery, foundPlaces);
			}
		}		
	}
}