using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.Mapbox;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace Gloobster.DomainModels
{
    public class TripWaypointsDomain : ITripWaypointsDomain
    {
        public IDbOperations DB { get; set; }

        public async Task Generate(string tripId)
        {
            var tripIdObj = new ObjectId(tripId);
            var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

            var maxOrderNo = trip.Places.Max(o => o.OrderNo);

            for (int act = 1; act <= maxOrderNo - 1; act++)
            {
                TripPlaceSE actPlace = PlaceByNo(trip, act);
                TripPlaceSE nextPlace = PlaceByNo(trip, act + 1);

                var travel = trip.Travels.FirstOrDefault(t => t.id == actPlace.LeavingId);

                var points = GetWayPoints(actPlace.Place.Coordinates, nextPlace.Place.Coordinates, travel.Type);

                var updated = await UpdateTravelProperty(tripIdObj, travel.id, "WayPoints", points);
            }
        }

        private async Task<bool> UpdateTravelProperty(ObjectId tripIdObj, ObjectId travelIdObj, string propName, object value)
        {
            var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) & DB.F<TripEntity>().Eq("Travels._id", travelIdObj);
            var update = DB.U<TripEntity>().Set("Travels.$." + propName, value);

            var res = await DB.UpdateAsync(filter, update);
            return res.ModifiedCount == 1;
        }

        private TripPlaceSE PlaceByNo(TripEntity trip, int orderNo)
        {
            return trip.Places.FirstOrDefault(p => p.OrderNo == orderNo);
        }

        private List<LatLng> GetWayPoints(LatLng from, LatLng to, TravelType travelType)
        {
            List<LatLng> points = null;

            if (travelType == TravelType.Plane || travelType == TravelType.Ship || travelType == TravelType.Train)
            {
                points = new List<LatLng> { from, to };
            }
            if (travelType == TravelType.Car || travelType == TravelType.Bus)
            {
                points = CallMapbox(from, to, "mapbox.driving");
            }
            if (travelType == TravelType.Walk)
            {
                points = CallMapbox(from, to, "mapbox.walking");
            }
            if (travelType == TravelType.Bike)
            {
                points = CallMapbox(from, to, "mapbox.cycling");
            }

            if (points == null)
            {
                points = new List<LatLng> { from, to };
            }

            return points;
        }

        private string DTS(double d)
        {
            return d.ToString("0.000").Replace(",", ".");
        }

        private List<LatLng> CallMapbox(LatLng from, LatLng to, string mapboxTravelType)
        {
            //HTTP 429 Too Many Requests
            try
            {
                var url =
                    $"https://api.mapbox.com/v4/directions/{mapboxTravelType}/{DTS(from.Lng)},{DTS(from.Lat)};{DTS(to.Lng)},{DTS(to.Lat)}.json";

                var qb = new QueryBuilder();
                qb
                    .BaseUrl(url)
                    .Param("access_token", GloobsterConfig.MapBoxSecret);

                var fullUrl = qb.Build();

                string jsonStr = null;
                using (var client = new WebClient())
                {
                    jsonStr = client.DownloadString(fullUrl);
                }

                var resp = JsonConvert.DeserializeObject<MapboxDirectionResponse>(jsonStr);

                if (!resp.routes.Any())
                {
                    return null;
                }

                var route = resp.routes.First();

                var points = new List<LatLng>();

                var coords = route.geometry.coordinates;

                int cnt = coords.Count;

                if (cnt <= 5)
                {
                    return coords.Select(ToLatLng).ToList();
                }

                int stepBy = (int) (cnt*0.01);
                if (stepBy < 1)
                {
                    stepBy = 1;
                }

                points.Add(ToLatLng(coords.First()));
                for (int act = 1; act <= coords.Count - 2; act = act + stepBy)
                {
                    var coord = coords[act];
                    var point = ToLatLng(coord);
                    points.Add(point);
                }
                points.Add(ToLatLng(coords.Last()));

                return points;
            }
            catch (Exception exc)
            {
                return null;
            }
        }

        private LatLng ToLatLng(List<double> coord)
        {
            return new LatLng { Lat = coord[1], Lng = coord[0] };
        }
    }
    
}