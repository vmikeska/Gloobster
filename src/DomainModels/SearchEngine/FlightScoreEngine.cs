using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Enums.SearchEngine;
using FlightDO = Gloobster.DomainObjects.SearchEngine.FlightDO;

namespace Gloobster.DomainModels.SearchEngine
{
    public class FlightScoreEngine : IFlightScoreEngine
    {
        public IDbOperations DB { get; set; }
        public IOldAirportsCache AirCache { get; set; }

        public double MinIndexByScoreLevel(ScoreLevel level)
        {
            double oneLevel = 0.5/3;
            double baseIndex = 0.5;

            if (level == ScoreLevel.Standard)
            {
                return baseIndex;
            }

            if (level == ScoreLevel.Good)
            {
                return baseIndex + oneLevel;
            }

            return baseIndex + (oneLevel*2);
        }

        public ScoredFlightsDO FilterFlightsByScore(List<FlightDO> allFlights, ScoreLevel level = ScoreLevel.Standard)
        {
            var res = new ScoredFlightsDO
            {
                Discarded = new List<FlightDO>(),
                Passed = new List<FlightDO>()
            };

            foreach (var f in allFlights)
            {
                double? score = null;
                try
                {
                    score = EvaluateFlight(f);
                }
                catch (Exception exc)
                {
                    //todo: add logging 
                }

                if (!score.HasValue)
                {
                    res.Discarded.Add(f);
                    continue;
                }

                f.FlightScore = score.Value;

                double treshold = MinIndexByScoreLevel(level);

                if (score >= treshold)
                {
                    res.Passed.Add(f);
                }
                else
                {
                    res.Discarded.Add(f);
                }
            }

            return res;
        }

        public double? EvaluateFlight(FlightDO flight)
        {   
            var parts = SplitInboundOutboundFlight(flight.FlightParts, flight.To);
            var thereParts = parts[0];
            var backParts = parts[1];

            int halfPrice = (int)(flight.Price/2);
            var thereScore = EvaluateSingleFlight(thereParts, halfPrice);
            var backScore = EvaluateSingleFlight(backParts, halfPrice);

            if (!thereScore.HasValue || !backScore.HasValue)
            {
                return null;
            }

            double avgScore = (thereScore.Value + backScore.Value)/2;
            return avgScore;
        }

        private List<List<FlightPartDO>> SplitInboundOutboundFlight(List<FlightPartDO> flightParts, string to)
        {
            var thereParts = new List<FlightPartDO>();
            var backParts = new List<FlightPartDO>();

            var thereFinished = false;

            foreach (var part in flightParts)
            {
                if (thereFinished)
                {
                    backParts.Add(part);
                }
                else
                {
                    thereParts.Add(part);
                }

                if (part.To == to)
                {
                    thereFinished = true;
                }
            }

            return new List<List<FlightPartDO>> {thereParts, backParts};
        }


        private double? EvaluateSingleFlight(List<FlightPartDO> parts, int price)
        {
            var firstPart = parts.First();
            var lastPart = parts.Last();

            string fromAir = firstPart.From;
            string toAir = lastPart.To;
            int stops = parts.Count - 1;

            TimeSpan durationSpan = lastPart.ArrivalTime - firstPart.DeparatureTime;
            
            var fromAirport = AirCache.GetByCode(fromAir);
            var toAirport = AirCache.GetByCode(toAir);

            bool airportOk = (toAirport?.Coord != null);
            if (!airportOk)
            {
                return null;
            }

            double distance = GetDistance(fromAirport.Coord, toAirport.Coord);

            double priceIndex = EvaluatePrice(distance, price);

            double timeIndex = 1;
            double stopsIndex = 1;
            if (stops > 0)
            {
                timeIndex = EvaluateTime(distance, durationSpan.TotalHours);
                stopsIndex = EvaluateStopsCount((int)distance, stops);
            }
            
            double avgIndex = (priceIndex + timeIndex + stopsIndex)/3;
            return avgIndex;
        }

        private double EvaluatePrice(double distance, double price)
        {
            //just for info
            const double goodPerKm = 0.04;

            double pricePerKm = price/distance;

            if (pricePerKm <= 0.0133)
            {
                return 1;
            }
            if (pricePerKm <= 0.02)
            {
                return 0.9;
            }
            if (pricePerKm <= 0.0266)
            {
                return 0.8;
            }
            if (pricePerKm <= 0.0333)
            {
                return 0.7;
            }
            if (pricePerKm <= 0.04)
            {
                return 0.6;
            }
            if (pricePerKm <= 0.0466)
            {
                return 0.5;
            }
            if (pricePerKm <= 0.0533)
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

        

    }
}