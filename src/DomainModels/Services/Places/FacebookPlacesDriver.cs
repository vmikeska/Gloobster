using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.BaseClasses;
using Gloobster.Enums;
using Gloobster.SocialLogin.Facebook.Communication;
using Serilog;

namespace Gloobster.DomainModels.Services.Places
{
    public class FacebookPlacesDriver : IPlacesExtractorDriver
	{
        public ILogger Log { get; set; }

		public IFacebookService FBService { get; set; }
		public ICountryService CountryService { get; set; }

		public string DbUserId;
		public SocAuthDO Authentication;

		private const string UserQueryBase = "/me/tagged_places";
		private const string UserQueryNext = UserQueryBase + "/?after={0}";

		public PlacesExtractionResults ExtractVisitedPlaces(string dbUserId, SocAuthDO auth)
		{
		    Log.Debug("ext:1");
			DbUserId = dbUserId;
			Authentication = auth;

			var taggedPlacesQuery = UserQueryBase;

			FBService.SetAccessToken(Authentication.AccessToken);
            Log.Debug("ext:2");
            var extractedPlaces = new List<FoundPlace>();
			Extract(taggedPlacesQuery, extractedPlaces);
            Log.Debug("ext:3");
            extractedPlaces.ForEach(i =>
			{
				i.CountryCode2 = CountryService.GetByCountryName(i.Country).CountryCode;
				i.CountryCode3 = CountryService.GetByCountryName(i.Country).IsoAlpha3;
			});
            Log.Debug("ext:4");
            var extractedPlacesDO = extractedPlaces.Select(p => FacebookPlaceToVisitedPlace(p, DbUserId)).ToList();
            Log.Debug("ext:5");
            return new PlacesExtractionResults {VisitedPlaces = extractedPlacesDO};
		}

		private VisitedPlaceDO FacebookPlaceToVisitedPlace(FoundPlace fbPlace, string portalUserId)
		{
			var localPlace = new VisitedPlaceDO
			{
				City = fbPlace.City,
				CountryCode = fbPlace.CountryCode2,
				Location = new LatLng { Lat = fbPlace.Latitude, Lng = fbPlace.Longitude },
				PortalUserId = portalUserId,
				Dates = new List<DateTime> { fbPlace.Time},

				SourceType = SourceType.FB,
				SourceId = fbPlace.CheckinId
			};
			return localPlace;
		}

		private void Extract(string query, List<FoundPlace> foundPlaces)
		{
			var response = FBService.Get<TaggedPlacesFO>(query);

		    var currentFoundPlaces = new List<FoundPlace>();

		    foreach (var item in response.Data)
		    {
		        bool validItem = item.Place.Location != null && 
                    !string.IsNullOrEmpty(item.Place.Location.Country) && 
                    !string.IsNullOrEmpty(item.Place.Location.City);
                if (validItem)
		        {
		            try
		            {
		                var converted = ConvertPlace(item);
		                currentFoundPlaces.Add(converted);
		            }
		            catch (Exception exc)
		            {
		                Log.Error($"FacebookPlaceExtraction: ${exc.Message}, query: ${query}");
		            }

		        }
		    }
            
			foundPlaces.AddRange(currentFoundPlaces);

			if (response.Paging != null)
			{
				var nextQuery = string.Format(UserQueryNext, response.Paging.Cursors.After);
				Extract(nextQuery, foundPlaces);
			}
		}

	    private FoundPlace ConvertPlace(DatumFO inPlace)
	    {
	        var outPlace = new FoundPlace
	        {
	            City = inPlace.Place.Location.City,
	            Country = inPlace.Place.Location.Country,
	            CheckinId = inPlace.Id,
	            Time = DateTime.Parse(inPlace.CreatedTime),
	            Latitude = inPlace.Place.Location.Latitude,
	            Longitude = inPlace.Place.Location.Longitude
	        };

	        return outPlace;
	    }

    }
}