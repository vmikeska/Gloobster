using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.BaseClasses;
using Gloobster.Enums;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels.Services.Places
{
	public class FacebookPlacesDriver : IPlacesExtractorDriver
	{
		public IFacebookService FBService { get; set; }
		public ICountryService CountryService { get; set; }

		public string DbUserId;
		public SocAuthDO Authentication;

		private const string UserQueryBase = "/{0}/tagged_places";
		private const string UserQueryNext = UserQueryBase + "/?after={1}";

		public PlacesExtractionResults ExtractVisitedPlaces(string dbUserId, SocAuthDO auth)        
		{			
			DbUserId = dbUserId;
			Authentication = auth;

			var taggedPlacesQuery = string.Format(UserQueryBase, auth.UserId);

			FBService.SetAccessToken(Authentication.AccessToken);

			var extractedPlaces = new List<FoundPlace>();
			Extract(taggedPlacesQuery, extractedPlaces);

			extractedPlaces.ForEach(i =>
			{
				i.CountryCode2 = CountryService.GetByCountryName(i.Country).CountryCode;
				i.CountryCode3 = CountryService.GetByCountryName(i.Country).IsoAlpha3;
			});

			var extractedPlacesDO = extractedPlaces.Select(p => FacebookPlaceToVisitedPlace(p, DbUserId)).ToList();
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
				var nextQuery = string.Format(UserQueryNext, Authentication.UserId, response.Paging.Cursors.After);
				Extract(nextQuery, foundPlaces);
			}
		}
		
	}
}