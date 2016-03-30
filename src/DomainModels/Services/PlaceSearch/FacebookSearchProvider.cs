using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FourSquare.SharpSquare.Entities;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class FacebookSearchProvider: ISearchProvider
	{
		public IFacebookService Service { get; set; }
		public ICountryService CountrySvc { get; set; }
        public IAccountDomain AccountDomain { get; set; }

        public bool CanBeUsed(SearchServiceQueryDO queryObj)
        {
            var fbAuth = AccountDomain.GetAuth(SocialNetworkType.Facebook, queryObj.PortalUser.UserId);

            bool hasFacebookUser = queryObj.PortalUser != null && fbAuth != null;
			return hasFacebookUser;
		}

		public async Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj)
		{
            var fbAuth = AccountDomain.GetAuth(SocialNetworkType.Facebook, queryObj.PortalUser.UserId);
            
			Service.SetAccessToken(fbAuth.AccessToken);

			var queryBuilder = new QueryBuilder()
				.Endpoint("search")
				.Param("q", queryObj.Query)
				.Param("type", "place")
				.Param("limit", queryObj.LimitPerProvider.ToString());

			if (queryObj.Coordinates != null)
			{
				queryBuilder.Param("center", $"{queryObj.Coordinates.Lat.ToString("0.000").Replace(",",".")},{queryObj.Coordinates.Lng.ToString("0.000").Replace(",", ".")}");				
            }

			var url = queryBuilder.Build();
			
			var result = Service.Get<SearchedPlacesFO>(url);
			var resultConverted = result.Data.Select(Convert).ToList();

		    if (queryObj.MustHaveCity)
		    {
		        resultConverted = resultConverted.Where(c => !string.IsNullOrEmpty(c.City)).ToList();
		    }

            if (queryObj.MustHaveCountry)
            {
                resultConverted = resultConverted.Where(c => !string.IsNullOrEmpty(c.CountryCode)).ToList();
            }

            return resultConverted;
		}

		private Place Convert(SearchPlaceFO originalPlace)
		{
			var countryCode = string.Empty;
			var latLng = new LatLng();			
			var city = string.Empty;
			var address = string.Empty;

			var location = originalPlace.Location;
			if (location != null)
			{
				var country = CountrySvc.GetByCountryName(location.Country);
				if (country != null)
				{
					countryCode = country.CountryCode;
				}

				city = location.City;

				latLng.Lat = location.Latitude;
				latLng.Lng = location.Longitude;

				address = $"{location.Street}, {location.City}, {location.Zip}";
			}

			var place = new Place
			{
				SourceType = SourceType.FB,
				SourceId = originalPlace.Id,
				Name = originalPlace.Name,
				City = city,
				
				CountryCode = countryCode,
				Coordinates = latLng,
				Address = address
			};
			return place;
		}
	}

	
}