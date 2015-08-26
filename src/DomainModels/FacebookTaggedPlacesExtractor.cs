using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.DomainModels.Services;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels
{
	public interface IFacebookTaggedPlacesExtractor
	{
		void SetUserData(string accessToken, string userId);
		void ExtractAll();

		List<FoundPlace> ExtractedPlaces { get; set; }
		List<FoundPlace> UniquePlaces { get; set; }
		List<string> UniqueCountries { get; set; }
	}

	public class FacebookTaggedPlacesExtractor: IFacebookTaggedPlacesExtractor
	{
		public string AccessToken;
		public string UserId;
		public IFacebookService FBService;
		public IGeoService GeoService;

		private const string UserQueryBase = "/{0}/tagged_places";
		private const string UserQueryNext = UserQueryBase + "/?after={1}";

		public List<FoundPlace> ExtractedPlaces { get; set; }
		public List<FoundPlace> UniquePlaces { get; set; }
		public List<string> UniqueCountries { get; set; }


		public FacebookTaggedPlacesExtractor(IFacebookService fbService, IGeoService geoService)
		{
			FBService = fbService;
			GeoService = geoService;
		}

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
				i.CountryCode2 = GeoService.GetByCountryName(i.Country).CountryCode;
				i.CountryCode3 = GeoService.GetByCountryName(i.Country).IsoAlpha3;
			});
			
			UniquePlaces = PlacesDistinct(ExtractedPlaces);

			UniqueCountries = UniquePlaces.Select(p => p.Country).Distinct().ToList();
		}

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
				Time = DateTime.Parse(i.CreatedTime)
			});
			foundPlaces.AddRange(currentFoundPlaces);

			if (response.Paging != null)
			{
				var nextQuery = string.Format(UserQueryNext, UserId, response.Paging.Cursors.After);
				Extract(nextQuery, foundPlaces);
			}
		}		
	}

	public class FoundPlace : IEquatable<FoundPlace>
	{
		public string CheckinId { get; set; }

		public DateTime Time { get; set; }

		public string City { get; set; }
		public string Country { get; set; }
		public string CountryCode2 { get; set; }
		public string CountryCode3 { get; set; }

		public bool Equals(FoundPlace other)
		{
			return this.Country == other.Country && this.City == other.City;
		}
	}
}