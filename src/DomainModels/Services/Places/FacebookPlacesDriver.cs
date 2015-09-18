using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels.Services.Places
{
	public class FacebookPlacesDriver : IPlacesExtractorDriver
	{
		public IFacebookService FBService { get; set; }
		public ICountryService CountryService { get; set; }

		public string DbUserId;
		public FacebookUserAuthenticationDO Authentication;

		private const string UserQueryBase = "/{0}/tagged_places";
		private const string UserQueryNext = UserQueryBase + "/?after={1}";
		
		public List<VisitedPlaceDO> ExtractNewVisitedPlaces(string dbUserId, object auth)
		{
			Authentication = (FacebookUserAuthenticationDO) auth;			
			DbUserId = dbUserId;

			var taggedPlacesQuery = string.Format(UserQueryBase, Authentication.UserId);

			FBService.SetAccessToken(Authentication.AccessToken);

			var extractedPlaces = new List<FoundPlace>();
			Extract(taggedPlacesQuery, extractedPlaces);

			extractedPlaces.ForEach(i =>
			{
				i.CountryCode2 = CountryService.GetByCountryName(i.Country).CountryCode;
				i.CountryCode3 = CountryService.GetByCountryName(i.Country).IsoAlpha3;
			});

			var extractedPlacesDO = extractedPlaces.Select(p => FacebookPlaceToVisitedPlace(p, DbUserId)).ToList();
			return extractedPlacesDO;
		}

		private VisitedPlaceDO FacebookPlaceToVisitedPlace(FoundPlace fbPlace, string portalUserId)
		{
			var localPlace = new VisitedPlaceDO
			{
				City = fbPlace.City,
				CountryCode = fbPlace.CountryCode2,
				PlaceLatitude = fbPlace.Latitude,
				PlaceLongitude = fbPlace.Longitude,

				PortalUserId = portalUserId,

				SourceType = SourceTypeDO.Facebook,
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