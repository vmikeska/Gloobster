using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FourSquare.SharpSquare.Entities;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class FoursquareSearchProvider : ISearchProvider
	{
		public IFoursquareService Service { get; set; }

		public bool CanBeUsed => true;

		public PortalUserDO PortalUser { get; set; }

		public async Task<List<Place>> SearchAsync(string query, LatLng coordinates = null)
		{
			var prms = new Dictionary<string, string>
			{
				{"query", query}
			};

			if (coordinates != null)
			{
				prms.Add("ll", $"{coordinates.Lat},{coordinates.Lng}");
			}
			else
			{
				prms.Add("intent", "global");
			}

			List<Venue> venues = Service.Client.SearchVenues(prms);
			List<Place> places = venues.Select(Convert).ToList();
			return places;
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