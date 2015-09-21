using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FourSquare.SharpSquare.Entities;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class FacebookSearchProvider: ISearchProvider
	{
		public IFacebookService Service { get; set; }
		public ICountryService CountrySvc { get; set; }

		
		public bool CanBeUsed(SearchServiceQuery queryObj)
		{
			bool hasFacebookUser = queryObj.PortalUser != null && queryObj.PortalUser.Facebook != null;
			return hasFacebookUser;
		}

		public async Task<List<Place>> SearchAsync(SearchServiceQuery queryObj)
		{
			Service.SetAccessToken(queryObj.PortalUser.Facebook.Authentication.AccessToken);

			var queryBuilder = new QueryBuilder()
				.Endpoint("search")
				.Param("q", queryObj.Query)
				.Param("type", "place")
				.Param("limit", queryObj.LimitPerProvider.ToString());

			if (queryObj.Coordinates != null)
			{
				queryBuilder.Param("center", $"{queryObj.Coordinates.Lat},{queryObj.Coordinates.Lng}");
			}

			var url = queryBuilder.Build();
			
			var result = Service.Get<SearchedPlacesFO>(url);
			var resultConverted = result.Data.Select(Convert).ToList();

			return resultConverted;
		}

		private Place Convert(SearchPlaceFO originalPlace)
		{
			var countryCode = string.Empty;
			var latLng = new LatLng();			
			var city = string.Empty;

			if (originalPlace.Location != null)
			{
				var country = CountrySvc.GetByCountryName(originalPlace.Location.Country);
				if (country != null)
				{
					countryCode = country.CountryCode;
				}

				city = originalPlace.Location.City;

				latLng.Lat = originalPlace.Location.Latitude;
				latLng.Lng = originalPlace.Location.Longitude;
			}

			var place = new Place
			{
				SourceType = SourceType.FB,
				SourceId = originalPlace.Id,
				Name = originalPlace.Name,
				City = city,
				
				CountryCode = countryCode,
				Coordinates = latLng
			};
			return place;
		}
	}

	
}