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
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using ILogger = Serilog.ILogger;

namespace Gloobster.DomainModels
{
	public class SharedMapImageDomain: ISharedMapImageDomain
	{		
		public IDbOperations DB { get; set; }
        public ILogger Log { get; set; }

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
		    try
		    {
		        var userIdObj = new ObjectId(userId);
		        var visited = DB.FOD<VisitedEntity>(v => v.User_id == userIdObj);
                
		        if (visited == null)
		        {
		            throw new Exception("NoVisitedFound");
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
		    catch (Exception exc)
		    {
                Log.Error("Map logger, GeneratePinBoardMapLink: " + exc.Message);
		        throw;
		    }
		}
		
		public string GenerateMapLink(string tripId)
		{
			var tripIdObj = new ObjectId(tripId);
			var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

			if (trip == null)
			{
			    throw new Exception("NoTripFound");
			}
			
			var features = GetFeatures(trip);

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

	    private Stream GetFile(string link)
	    {
	        try
	        {
	            using (var client = new WebClient())
	            {                    
	                Stream stream = client.OpenRead(link);
	                return stream;
	            }
	        }
            catch (Exception exc)
            {
                Log.Error("Map logger, GetFile, link: " + link);
                throw;
            }
        }
	

		private List<FeatureBaseDO> GetFeatures(TripEntity trip)
		{
            var pathFeature = new FeaturePathDO
			{
				Points = new List<LatLng>(),
                StrokeColor = "550000",
                StrokeSize = "4",
                StrokeOpacity = "1"
            };
            
            var features = new List<FeatureBaseDO>
		    {
		        pathFeature
		    };

            var orderedPlaces = trip.Places.OrderBy(p => p.OrderNo);
			foreach (var place in orderedPlaces)
			{
			    var cityMarker = new FeatureMarkerDO
			    {
			        Coord = place.Place.Coordinates,
			        PinType = "town",
			        PinSize = 3,
			        Color = "666699"
			    };
			    features.Add(cityMarker);
                
                var travel = trip.Travels.FirstOrDefault(t => t.id == place.LeavingId);

			    if (travel?.WayPoints != null)
			    {
			        pathFeature.Points.AddRange(travel.WayPoints);
			    }
			}

			return features;
		}

		private List<FeatureMarkerDO> GetPinBoardMarkers(VisitedEntity visited)
		{
			var list = visited.Cities.Select(city => new FeatureMarkerDO
			{
				PinType = "town",
				PinSize = 3,
				Color = "666699",
				Coord = city.Location
			}).ToList();
			return list;
		}
	}
}