using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;
using TweetSharp;
using System.Linq;
using Gloobster.DomainModelsCommon.Interfaces;

namespace Gloobster.DomainModels.Services.Places
{
	public class TwitterPlacesDriver: IPlacesExtractorDriver
	{
		public TwitterService TwitterSvc;

		public SocAuthenticationDO Authentication;

		private const int PageSize = 200;

		public List<VisitedPlaceDO> ExtractNewVisitedPlaces(string dbUserId, SocAuthenticationDO auth)
		{
			Authentication = (SocAuthenticationDO) auth;

			TwitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
			TwitterSvc.AuthenticateWith(Authentication.AccessToken, Authentication.TokenSecret);

			long userId = long.Parse(Authentication.UserId);
			var allTweets = ExtractAllTweets(userId);

			long lastExtractedId = allTweets.Max(t => t.Id);

			var tweetsWithPlaces = allTweets.Where(t => t.Place != null && t.Place.PlaceType == TwitterPlaceType.City);
			//todo: maybe add extraction for Countries as well
			var tweetPlaces = tweetsWithPlaces.Select(t => t.Place).ToList();

			var visitedPlaces = tweetPlaces.Select(p => FacebookPlaceToVisitedPlace(p, dbUserId)).ToList();
			
			return visitedPlaces;
		}

		private VisitedPlaceDO FacebookPlaceToVisitedPlace(TwitterPlace twPlace, string portalUserId)
		{
			var localPlace = new VisitedPlaceDO
			{
				City = twPlace.Name,
				CountryCode = twPlace.CountryCode,
				//PlaceLatitude = twPlace.Latitude,
				//PlaceLongitude = twPlace.Longitude,

				PortalUserId = portalUserId,

				SourceType = SourceTypeDO.Twitter,
				SourceId = twPlace.Id
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