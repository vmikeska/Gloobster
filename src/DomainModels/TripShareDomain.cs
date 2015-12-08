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
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class TripShareDomain : ITripShareDomain
	{
		public IDbOperations DB { get; set; }

		public ISharedMapImageDomain ShareMapImage { get; set; }

		public void ShareTrip(ShareTripDO share)
		{


			var userIdObj = new ObjectId(share.UserId);
			var sharingUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);

			var tripIdObj = new ObjectId(share.TripId);
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			var fbAuth = sharingUser.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Facebook);

			var orderedPlaces = trip.Places.OrderBy(p => p.OrderNo);

			TripPlaceSE firstPlace = orderedPlaces.First();
			TripPlaceSE lastPlace = orderedPlaces.Last();

			bool userFbAuthenticated = fbAuth != null;
			bool shareToFb = share.Networks.Contains(SocialNetworkType.Facebook);
			if (shareToFb && userFbAuthenticated)
			{
				var fbShare = new FacebookShare();

				var opts = new FacebookShareOptionsDO
				{
					Message = share.Message,
					Picture = GetImageLink(share.TripId),

					Name = GetName(firstPlace, lastPlace),
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

				fbShare.Share(opts, fbAuthDO);
			}
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

			if (GloobsterConfig.IsDebug)
			{
				link = ShareMapImage.GenerateMapLink(tripId);
			}
			else
			{
				var protocol = "http";
				link = $"{protocol}://{GloobsterConfig.Domain}/Trip/SharedMapImage/{tripId}";
			}

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