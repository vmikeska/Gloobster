using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Facebook;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;

namespace Gloobster.DomainModels
{
	public class FacebookDomain: IFacebookDomain
	{
		public IVisitedCountriesDomain VisitedCountries { get; set; }
		public IFacebookTaggedPlacesExtractor TaggedPlacesExtractor { get; set; }
		public IVisitedPlacesDomain VisitedPlacesDomain { get; set; }


		public async void UpdateVisitedPlaces(string fbUserId, string dbUserId, string accessToken)
		{
			TaggedPlacesExtractor.SetUserData(accessToken, fbUserId);

			TaggedPlacesExtractor.ExtractAll();
			
			var extractedPlaces = TaggedPlacesExtractor.UniquePlaces.Select(p => FacebookPlaceToVisitedPlace(p, dbUserId)).ToList();

			List<VisitedPlaceDO> newPlaces = await VisitedPlacesDomain.AddNewPlaces(extractedPlaces, dbUserId);
			var newCountriesList = newPlaces.Select(p => p.CountryCode).Distinct();
			var newCountriesDO = newCountriesList.Select(c => new VisitedCountryDO {CountryCode2 = c}).ToList();

			var newAddedCountries = await VisitedCountries.AddNewCountries(newCountriesDO, dbUserId);

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

		

	}

	


}