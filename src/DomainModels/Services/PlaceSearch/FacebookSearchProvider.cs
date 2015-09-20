using System.Collections.Generic;
using System.Threading.Tasks;
using FourSquare.SharpSquare.Entities;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class FacebookSearchProvider: ISearchProvider
	{
		public IFacebookService Service { get; set; }

		public bool CanBeUsed
		{
			get
			{
				bool hasFacebookUser = PortalUser != null && PortalUser.Facebook != null; 
				return hasFacebookUser;
			}
		}

		public PortalUserDO PortalUser { get; set; }

		public async Task<List<Place>> SearchAsync(string query, LatLng coordinates = null)
		{
			Service.SetAccessToken(PortalUser.Facebook.Authentication.AccessToken);

			var queryBuilder = new QueryBuilder()
				.Endpoint("search")
				.Param("q", query)
				.Param("type", "place");

			if (coordinates != null)
			{
				queryBuilder.Param("center", $"{coordinates.Lat},{coordinates.Lng}");
			}

			var url = queryBuilder.Build();
			
			var result = Service.Get<SearchedPlacesFO>(query);
			return null;
		}

		private Place Convert(Venue originalPlace)
		{
			var place = new Place
			{
				SourceType = SourceType.S4,
				SourceId = originalPlace.id,
				Name = originalPlace.name,
				City = originalPlace.location.city,
				CountryCode = originalPlace.location.cc,
				Coordinates = new LatLng { Lat = originalPlace.location.lat.ToString(), Lng = originalPlace.location.lng.ToString() }
			};
			return place;
		}
	}

	
}