using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using System.Linq;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
    public class YelpSearchProvider : ISearchProvider
    {   
        public IYelpSearchService SearchService { get; set; }

        public bool CanBeUsed(SearchServiceQueryDO queryObj)
        {
            return queryObj.Coordinates != null;
        }

        public async Task<List<Place>> SearchAsync(SearchServiceQueryDO queryObj)
        {
            var result = await SearchService.Search(queryObj.Query, queryObj.Coordinates);
            
            List<Place> places = result.businesses.Select(Convert).ToList();
            return places;
        }
        
        private Place Convert(Business originalPlace)
        {
            var location = originalPlace.location;
            var address = $"{string.Join(",", location.address)}, {location.city}, {location.postal_code}";

            var place = new Place
            {
                SourceType = SourceType.Yelp,
                SourceId = originalPlace.id,
                Name = originalPlace.name,
                City = originalPlace.location.city,
                CountryCode = originalPlace.location.country_code,
                Coordinates = new LatLng { Lat = originalPlace.location.coordinate.latitude, Lng = originalPlace.location.coordinate.longitude },
                Address = address
            };


            return place;
        }
    }
}