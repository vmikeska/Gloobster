using System;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Sharing.Facebook;
using System.Linq;
using Gloobster.Common;
using Gloobster.Entities.Trip;
using Gloobster.Mappers;
using Gloobster.Sharing.Twitter;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class TripShareDomain : ITripShareDomain
	{
		public IDbOperations DB { get; set; }
		public ISharedMapImageDomain ShareMapImage { get; set; }
		public ITwitterShare TwitterShare { get; set; }
		public IFacebookShare FacebookShare { get; set; }

		public void ShareTrip(ShareTripDO share)
		{
			var userIdObj = new ObjectId(share.UserId);
			var tripIdObj = new ObjectId(share.TripId);

			var sharingUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);						
			SocialAccountSE fbAuth = sharingUser.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Facebook);
			SocialAccountSE twAuth = sharingUser.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Twitter);

			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			bool userFbAuthenticated = fbAuth != null;
			bool shareToFb = share.Networks.Contains(SocialNetworkType.Facebook);
			if (shareToFb && userFbAuthenticated)
			{
				ShareToFB(share, trip, fbAuth);
			}

			bool userTwAuthenticated = twAuth != null;
			bool shareToTwitter = share.Networks.Contains(SocialNetworkType.Twitter);			
			if (shareToTwitter && userTwAuthenticated)
			{
				ShareToTwitter(share, trip, twAuth);
			}
		}

		private void ShareToTwitter(ShareTripDO share, TripEntity trip, SocialAccountSE twAuth)
		{
			var opts = new TwitterShareOptionsDO
			{
				Link = GetSharePageLink(share.TripId),
				ImagePath = GetLocalImageLink(share.TripId),
				Status = share.Message
			};

			var authDO = twAuth.Authentication.ToDO();			
			TwitterShare.Tweet(opts, authDO);
		}

		private Tuple<TripPlaceSE, TripPlaceSE> GetFirstAndLastPlace(TripEntity trip)
		{
			var orderedPlaces = trip.Places.OrderBy(p => p.OrderNo);

			TripPlaceSE firstPlace = orderedPlaces.First();
			TripPlaceSE lastPlace = orderedPlaces.Last();

			return new Tuple<TripPlaceSE, TripPlaceSE>(firstPlace, lastPlace);
		}

		private void ShareToFB(ShareTripDO share, TripEntity trip, SocialAccountSE fbAuth)
		{
			var firstLastPlace = GetFirstAndLastPlace(trip);
			
			var opts = new FacebookShareOptionsDO
			{
				Message = share.Message,
				Picture = GetImageLink(share.TripId),

				Name = GetName(firstLastPlace.Item1, firstLastPlace.Item2),
				Description = "See the trip of this guy",

				Caption = "Join Gloobster.com, web for travelers",

				Link = GetSharePageLink(share.TripId),

				Privacy = new FacebookPrivacyDO
				{
					Description = "This is debug, only I can see it",
					Value = FacebookPrivacyLevel.SELF
				}
			};

			var fbAuthDO = fbAuth.Authentication.ToDO();

			FacebookShare.Share(opts, fbAuthDO);
		}

		private string GetName(TripPlaceSE firstPlace, TripPlaceSE lastPlace)
		{
			if (firstPlace.Place != null && lastPlace.Place != null)
			{
				return $"I am traveling from {firstPlace.Place.SelectedName} to {lastPlace.Place.SelectedName}";
			}
			
			return "I am traveling somewhere";			
		}

		private string GetImageLink (string tripId)
		{
			string link;

			if (GloobsterConfig.IsLocal)
			{
				link = ShareMapImage.GenerateMapLink(tripId);
			}
			else
			{
				link = GetLocalImageLink(tripId);
			}

			return link;
		}

		private string GetLocalImageLink(string tripId)
		{
			var protocol = "http";
			var link = $"{protocol}://{GloobsterConfig.Domain}/Trip/SharedMapImage/{tripId}";
			return link;
		}

		private string GetSharePageLink(string tripId)
		{
			var protocol = "http";
			var link = $"{protocol}://{GloobsterConfig.Domain}/Trip/Share/{tripId}";
			return link;
		}

	}




}