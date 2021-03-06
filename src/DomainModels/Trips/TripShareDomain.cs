using System;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.DomainModels
{
	public class TripShareDomain : ITripShareDomain
	{
        public ILogger Log { get; set; }

        public IDbOperations DB { get; set; }
		public ISharedMapImageDomain ShareMapImage { get; set; }
		public ITwitterShare TwitterShare { get; set; }
		public IFacebookShare FacebookShare { get; set; }
        public IAccountDomain AccountDomain { get; set; }
        public ILanguages Langs { get; set; }
        public ITripPermissionsDomain Perms { get; set; }

        public ITripWaypointsDomain WaypointDomain { get; set; }

        public string GetWord(string key, string lang)
        {
            string word = Langs.GetWord("sharing", key, lang);
            return word;
        }

        public async Task ShareTrip(ShareTripDO share)
        {
            Perms.HasEditPermissions(share.TripId, share.UserId, true);

            await WaypointDomain.Generate(share.TripId);

            var tripIdObj = new ObjectId(share.TripId);

            var fbAuth = AccountDomain.GetAuth(SocialNetworkType.Facebook, share.UserId);
            var twAuth = AccountDomain.GetAuth(SocialNetworkType.Twitter, share.UserId);

            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

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

            UpdateTripShareMessage(tripIdObj, share.Message);
		}

	    private void UpdateTripShareMessage(ObjectId tripIdObj, string message)
	    {
	        var f = DB.F<TripEntity>().Eq(t => t.id, tripIdObj);
            var u = DB.U<TripEntity>().Set(t => t.LastSharingMessage, message);
	        DB.UpdateAsync(f, u);
	    }

		private void ShareToTwitter(ShareTripDO share, TripEntity trip, SocAuthDO twAuth)
		{
            try
            {
                var opts = new TwitterShareOptionsDO
                {
                    Link = GetSharePageLink(share.TripId),
                    ImagePath = GetLocalImageLink(share.TripId),
                    Status = share.Message
                };

                TwitterShare.Tweet(opts, twAuth);
            }
            catch (Exception exc)
            {
                Log.Error($"ShareToTwitter: {exc.Message}");
            }            
		}

		private Tuple<TripPlaceSE, TripPlaceSE> GetFirstAndLastPlace(TripEntity trip)
		{
			var orderedPlaces = trip.Places.OrderBy(p => p.OrderNo);

			TripPlaceSE firstPlace = orderedPlaces.First();
			TripPlaceSE lastPlace = orderedPlaces.Last();

			return new Tuple<TripPlaceSE, TripPlaceSE>(firstPlace, lastPlace);
		}

		private void ShareToFB(ShareTripDO share, TripEntity trip, SocAuthDO fbAuth)
		{
		    try
		    {
                var userIdObj = new ObjectId(share.UserId);
                var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);

                var firstLastPlace = GetFirstAndLastPlace(trip);

		        var opts = new FacebookShareOptionsDO
		        {
		            Message = share.Message,
		            Picture = GetImageLink(share.TripId),

		            Name = GetName(firstLastPlace.Item1, firstLastPlace.Item2, user.DefaultLang),
		            Description = string.Format(GetWord("TripShare", user.DefaultLang), user.DisplayName),
                    
                    Caption = GetWord("FbShare3", user.DefaultLang),

		            Link = GetSharePageLink(share.TripId)
		        };

		        FacebookShare.Share(opts, fbAuth);
		    }
		    catch (Exception exc)
		    {
                Log.Error($"ShareToFB: {exc.Message}");
            }
		}

		private string GetName(TripPlaceSE firstPlace, TripPlaceSE lastPlace, string lang)
		{
			if (firstPlace.Place != null && lastPlace.Place != null)
			{
			    return string.Format(GetWord("TravelFromTo", lang), firstPlace.Place.SelectedName, lastPlace.Place.SelectedName);
			}
			
            //this should not happen
			return "I am traveling";			
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
			var link = $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/Trip/SharedMapImage/{tripId}";
			return link;
		}

		private string GetSharePageLink(string tripId)
		{			
			var link = $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/Trip/Share/{tripId}";
			return link;
		}

	}




}