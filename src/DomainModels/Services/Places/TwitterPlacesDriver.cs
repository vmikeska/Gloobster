using System;
using System.Collections.Generic;
using Gloobster.Common;
using System.Linq;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using TweetSharp;

namespace Gloobster.DomainModels.Services.Places
{
	

	public class TwitterPlacesDriver: IPlacesExtractorDriver
	{
		public TwitterService TwitterSvc;

		public string DbUserId;
		public SocAuthenticationDO Authentication;

		private const int PageSize = 200;

		public PlacesExtractionResults ExtractVisitedPlaces(string dbUserId, SocAuthenticationDO auth)
		{
			DbUserId = dbUserId;
			Authentication = auth;

			var result = new PlacesExtractionResults();
			
			TwitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
			TwitterSvc.AuthenticateWith(Authentication.AccessToken, Authentication.TokenSecret);

			long userId = long.Parse(Authentication.UserId);
			var allTweets = ExtractAllTweets(userId);

			long lastExtractedId = allTweets.Max(t => t.Id);

			var tweetsWithCities = allTweets.Where(t => t.Place != null && t.Place.PlaceType == TwitterPlaceType.City);
			result.VisitedCities = tweetsWithCities.Select(t => TweetToVisitedCity(t, dbUserId)).ToList();
			
			var tweetsWithCountries = allTweets.Where(t => t.Place != null && t.Place.PlaceType == TwitterPlaceType.Country);
			result.VisitedCountries = tweetsWithCountries.Select(c => TweetToVisitedCountry(c, dbUserId)).ToList();
			
			return result;
		}

		private VisitedCityDO TweetToVisitedCity(TwitterStatus tweet, string portalUserId)
		{
			var twPlace = tweet.Place;

			LatLng location = null;
			if (tweet.Location != null && tweet.Location.Coordinates != null)
			{
				bool hasEmptyCoordinates = tweet.Location.Coordinates.Latitude == 0 && tweet.Location.Coordinates.Longitude == 0;
                if (!hasEmptyCoordinates)
				{
					location = new LatLng {Lat = tweet.Location.Coordinates.Latitude, Lng = tweet.Location.Coordinates.Longitude};
				}
			}
			
			var localPlace = new VisitedCityDO
			{
				City = twPlace.Name,
				CountryCode = twPlace.CountryCode,
				Dates = new List<DateTime> { tweet.CreatedDate},
				Location = location,				
				PortalUserId = portalUserId,				
			};
			return localPlace;
		}

		private VisitedCountryDO TweetToVisitedCountry(TwitterStatus tweet, string portalUserId)
		{
			var localPlace = new VisitedCountryDO
			{
				CountryCode2 = tweet.Place.CountryCode,
				Dates = new List<DateTime> { tweet.CreatedDate },
				PortalUserId = portalUserId				
			};
			return localPlace;
		}

		private List<TwitterStatus> ExtractAllTweets(long userId)
		{
			var allTweets = new List<TwitterStatus>();
			bool shouldExtract = true;
			long? lastMinExtracted = null;
			while (shouldExtract)
			{
				var currentTweets = ExtractTweets(userId, lastMinExtracted);

				if (currentTweets.Any())
				{
					allTweets.AddRange(currentTweets);
					lastMinExtracted = currentTweets.Last().Id - 1;

				}
				else
				{
					shouldExtract = false;
				}

			}

			return allTweets;
		}

		private List<TwitterStatus> ExtractTweets(long userId, long? maxId)
		{
			var options = new ListTweetsOnUserTimelineOptions
			{
				ExcludeReplies = true,
				Count = PageSize,
				UserId = userId
			};

			if (maxId.HasValue)
			{
				options.MaxId = maxId.Value;
			}

			IEnumerable<TwitterStatus> tweets = TwitterSvc.ListTweetsOnUserTimeline(options);
			return tweets.ToList();
		}
	}
}