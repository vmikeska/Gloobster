using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using FlightDO = Gloobster.DomainObjects.SearchEngine.FlightDO;

namespace Gloobster.DomainModels.SearchEngine
{
    public class FlightScoreEngine : IFlightScoreEngine
    {
        public IDbOperations DB { get; set; }
        
        private static List<NewAirportEntity> Airports;
        
        public double? EvaluateFlight(FlightDO flight)
        {
            const bool isReturn = true;

            if (Airports == null)
            {
                Airports = DB.List<NewAirportEntity>();
            }

            var fromAirport = GetAirport(flight.From);
            var toAirport = GetAirport(flight.To);

            if (toAirport == null)
            {
                return null;
            }

            //todo: should be fixed, like get distance from city or such. Or discard such a results
            if (toAirport.Coord == null)
            {
                return null;
            }

            double fromToDistance = GetDistance(fromAirport.Coord, toAirport.Coord);
            double distance = TotalDistance(fromToDistance, isReturn);

            int stops = flight.Connections - 1;
            if (isReturn)
            {
                stops--;
            }

            double priceIndex = EvaluatePrice(distance, flight.Price);
            double timeIndex = EvaluateTime(distance, flight.HoursDuration);
            double stopsIndex = EvaluateStopsCount((int)distance, stops);
            //todo: airport score

            double avgIndex = (priceIndex + timeIndex + stopsIndex)/3;

            return avgIndex;
        }

        private double TotalDistance(double distance, bool isReturn)
        {
            double totalDistance = isReturn ? 2 * distance : distance;
            return totalDistance;
        }

        private double EvaluatePrice(double distance, double price)
        {
            const double goodPerKm = 0.04;

            double pricePerKm = price/distance;

            if (pricePerKm <= 0.02)
            {
                return 1;
            }
            if (pricePerKm <= 0.03)
            {
                return 0.9;
            }
            if (pricePerKm <= 0.04)
            {
                return 0.8;
            }
            if (pricePerKm <= 0.05)
            {
                return 0.7;
            }
            if (pricePerKm <= 0.06)
            {
                return 0.6;
            }
            if (pricePerKm <= 0.07)
            {
                return 0.5;
            }
            if (pricePerKm <= 0.08)
            {
                return 0.4;
            }

            return 0.1;
        }

        private double EvaluateTime(double distance, double hours)
        {            
            double kmPerHour = distance/hours;

            if (kmPerHour >= 750)
            {
                return 1;
            }
            if (kmPerHour >= 650)
            {
                return 0.9;
            }
            if (kmPerHour >= 550)
            {
                return 0.8;
            }
            if (kmPerHour >= 450)
            {
                return 0.6;
            }
            if (kmPerHour >= 350)
            {
                return 0.5;
            }

            return 0.1;
        }

        private double EvaluateStopsCount(int distance, int stopsCount)
        {
            if (stopsCount == 0)
            {
                return 1;
            }

            if (distance <= 500)
            {
                return EvalStopsRange(stopsCount, new List<StopRating>
                {
                    new StopRating(1, 0.5)
                });
            }

            if (distance <= 1000)
            {
                return EvalStopsRange(stopsCount, new List<StopRating>
                {
                    new StopRating(1, 0.7),
                    new StopRating(2, 0.4)
                });
            }
            if (distance <= 1500)
            {
                return EvalStopsRange(stopsCount, new List<StopRating>
                {
                    new StopRating(1, 0.8),
                    new StopRating(2, 0.6)
                });
            }
            if (distance <= 2000)
            {
                return EvalStopsRange(stopsCount, new List<StopRating>
                {
                    new StopRating(1, 0.8),
                    new StopRating(2, 0.7)                    
                });
            }
            if (distance <= 2500)
            {
                return EvalStopsRange(stopsCount, new List<StopRating>
                {
                    new StopRating(1, 0.8),
                    new StopRating(2, 0.7),
                    new StopRating(3, 0.5)
                });
            }
            if (distance <= 4500)
            {
                return EvalStopsRange(stopsCount, new List<StopRating>
                {
                    new StopRating(1, 0.9),
                    new StopRating(2, 0.8),
                    new StopRating(3, 0.5)
                });
            }
            if (distance <= 7500)
            {
                return EvalStopsRange(stopsCount, new List<StopRating>
                {
                    new StopRating(1, 0.9),
                    new StopRating(2, 0.8),
                    new StopRating(3, 0.6)
                });
            }
            if (distance <= 12000)
            {
                return EvalStopsRange(stopsCount, new List<StopRating>
                {
                    new StopRating(1, 0.9),
                    new StopRating(2, 0.8),
                    new StopRating(3, 0.7),                    
                });
            }
            
            return EvalStopsRange(stopsCount, new List<StopRating>
            {
                new StopRating(1, 0.9),
                new StopRating(2, 0.8),
                new StopRating(3, 0.7),
                new StopRating(4, 0.5)
            });            
        }
        

        private double EvalStopsRange(int stops, List<StopRating> list)
        {
            foreach (var item in list)
            {
                if (item.Count == stops)
                {
                    return item.Rating;
                }
            }

            return DefaultMinStopsRating;
        }

        private const double DefaultMinStopsRating = 0.3;


        private int GetDistance(LatLng latLng1, LatLng latLng2)
        {
            var sCoord = new GeoCoordinate(latLng1.Lat, latLng1.Lng);
            var eCoord = new GeoCoordinate(latLng2.Lat, latLng2.Lng);

            double dist = sCoord.GetDistanceTo(eCoord);

            return (int)(dist/1000);            
        }

        private NewAirportEntity GetAirport(string code)
        {
            return Airports.FirstOrDefault(a => a.Code == code);
        }

    }
}