using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Sharing.Facebook;
using System.Linq;
using Gloobster.Common;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class TripShareDomain : ITripShareDomain
	{
		public const string MapBoxKey =
			"pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";


		public TripShareDomain()
		{
			MapImgCreator = new MapBoxImgCreator();
		}

		public IDbOperations DB { get; set; }

		public MapBoxImgCreator MapImgCreator { get; set; }

		private string GenerateImage()
		{
			var cfg = new BuildMapConfig
			{
				MapId = "mapbox.streets",
				Height = 500,
				Width = 500,
				MapCenter = new LatLng
				{
					Lat = 50.1,
					Lng = 8.8
				},
				Zoom = 13,
				Features = new List<FeatureBase>
				{
					new FeaturePath
					{
						Points = new Dictionary<int, LatLng>
						{
							{1, new LatLng {Lat = 50.09482, Lng = 8.76674}},
							{2, new LatLng {Lat = 50.09052, Lng = 8.78906}},
							{3, new LatLng {Lat = 50.08534, Lng = 8.77121}}
						}
					}
				}
			};

			var mapLink = MapImgCreator.BuildMap(cfg, MapBoxKey);
			return mapLink;
		}

		public void ShareTrip(ShareTripDO share)
		{
			var mapPictureLink = GenerateImage();

			var userIdObj = new ObjectId(share.UserId);
			var sharingUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);

			var fbAuth = sharingUser.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Facebook);
			bool userFbAuthenticated = fbAuth != null;
			
			bool shareToFb = share.Networks.Contains(SocialNetworkType.Facebook);
			
			if (shareToFb && userFbAuthenticated)
			{
				var fbShare = new FacebookShare();

				var opts = new FacebookShareOptionsDO
				{
					Message = share.Message,
					Picture = mapPictureLink,
					//"http://img.ihned.cz/attachment.php/390/48636390/WUDJghnwcE96i4uCA8OSpVtvz2r1GqI3/SVOZI013.jpg",

					Name = "I am going for a trip to somewhere",
					Description = "Join me on my super gorgeous mega trip",

					Caption = "Oh yes, I am really going there",

					Link = "https://www.mapbox.com/mapbox.js/example/v1.0.0/",
					
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
	}
}