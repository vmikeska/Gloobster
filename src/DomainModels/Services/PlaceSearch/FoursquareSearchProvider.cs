using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FourSquare.SharpSquare.Entities;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
	public class FoursquareSearchProvider : ISearchProvider
	{
		public IFoursquareService Service { get; set; }
		
		public bool CanBeUsed(SearchServiceQueryDO queryObj)
		{
			return true;
		}

		public async Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj)
		{
			var prms = new Dictionary<string, string>
			{
				{"query", queryObj.Query},
				{"limit", queryObj.LimitPerProvider.ToString() }
			};

			if (queryObj.Coordinates != null)
			{
				prms.Add("ll", $"{queryObj.Coordinates.Lat.ToString("0.000").Replace(",", ".")},{queryObj.Coordinates.Lng.ToString("0.000").Replace(",", ".")}");
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
			var location = originalPlace.location;
			var address = $"{location.address}, {location.city}, {location.postalCode}";

			var place = new Place
			{
				SourceType = SourceType.S4,
				SourceId = originalPlace.id,
				Name = originalPlace.name,
				City = originalPlace.location.city,
				CountryCode = originalPlace.location.cc,
				Coordinates = new LatLng { Lat = originalPlace.location.lat, Lng = originalPlace.location.lng },
				Address = address
			};


			return place;
		}
	}
}