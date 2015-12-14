using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class SharedMapImageDomain: ISharedMapImageDomain
	{		
		public IDbOperations DB { get; set; }

		public IMapBoxImgCreator ImageCreator { get; set; }

		public Stream GetMap(string tripId)
		{
			var link = GenerateMapLink(tripId);
			var mapImgStream = GetFile(link);
			return mapImgStream;
		}

		public Stream GetPinBoardMap(string userId)
		{
			var link = GeneratePinBoardMapLink(userId);
			var mapImgStream = GetFile(link);
			return mapImgStream;
		}

		public string GeneratePinBoardMapLink(string userId)
		{
			var userIdObj = new ObjectId(userId);
			var visited = DB.C<VisitedEntity>().FirstOrDefault(v => v.PortalUser_id == userIdObj);
			
			if (visited == null)
			{
				//throw
			}

			var markers = GetPinBoardMarkers(visited);

			var features = new List<FeatureBaseDO>();
			features.AddRange(markers);
			
			var cfg = new BuildMapConfigDO
			{
				MapId = "mapbox.streets",
				Height = 900,
				Width = 1200,
				AutoFit = true,
				Features = features
			};

			var mapLink = ImageCreator.BuildMapLink(cfg, GloobsterConfig.MapBoxSecret);
			return mapLink;
		}
		
		public string GenerateMapLink(string tripId)
		{
			var tripIdObj = new ObjectId(tripId);
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				//throw
			}
			
			var pathFeature = GetPathFeature(trip);

			var cfg = new BuildMapConfigDO
			{
				MapId = "mapbox.streets",
				Height = 900,
				Width = 1200,
				AutoFit = true,
				Features = new List<FeatureBaseDO>
				{
					pathFeature
				}
			};

			var mapLink = ImageCreator.BuildMapLink(cfg, GloobsterConfig.MapBoxSecret);
			return mapLink;
		}

		private Stream GetFile(string link)
		{
			var client = new WebClient();
			Stream stream = client.OpenRead(link);
			return stream;
		}

		private FeaturePathDO GetPathFeature(TripEntity trip)
		{
			var pathFeature = new FeaturePathDO
			{
				Points = new Dictionary<int, LatLng>()
			};

			var orderedPlaces = trip.Places.OrderBy(p => p.OrderNo);
			foreach (var place in orderedPlaces)
			{
				if (place.Place?.Coordinates != null)
				{
					pathFeature.Points.Add(place.OrderNo, place.Place.Coordinates);
				}
			}

			return pathFeature;
		}

		private List<FeatureMarkerDO> GetPinBoardMarkers(VisitedEntity visited)
		{
			var list = visited.Cities.Select(city => new FeatureMarkerDO
			{
				PinType = "town",
				PinSize = 1,
				Color = "666699",
				Coord = city.Location
			}).ToList();
			return list;
		}
	}
}