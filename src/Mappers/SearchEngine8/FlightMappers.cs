using System.Linq;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;

namespace Gloobster.Mappers.SearchEngine8
{
    public static class FlightMappers
    {
        public static FlightDO ToDO(this FlightSE e)
        {
            var d = new FlightDO
            {
                HoursDuration = e.HoursDuration,
                Price = e.Price,
                Connections = e.Connections,
                From = e.From,
                To = e.To,
                FlightScore = e.FlightScore,
                BookLink = e.BookLink
            };

            if (e.FlightParts != null)
            {
                d.FlightParts = e.FlightParts.Select(f => f.ToDO()).ToList();
            }

            return d;
        }

        public static FlightSE ToEntity(this FlightDO d)
        {
            var e = new FlightSE
            {
                HoursDuration = d.HoursDuration,
                Price = d.Price,
                Connections = d.Connections,
                From = d.From,
                To = d.To,
                FlightScore = d.FlightScore,
                BookLink = d.BookLink
            };

            if (d.FlightParts != null)
            {
                e.FlightParts = d.FlightParts.Select(f => f.ToEntity()).ToList();
            }

            return e;
        }

        public static FlightPartSE ToEntity(this FlightPartDO d)
        {
            var e = new FlightPartSE
            {
                From = d.From,
                To = d.To,
                ArrivalTime = d.ArrivalTime,
                DeparatureTime = d.DeparatureTime,
                Airline = d.Airline,
                MinsDuration = d.MinsDuration,
                FlightNo = d.FlightNo
            };

            return e;
        }

        public static FlightPartDO ToDO(this FlightPartSE e)
        {
            var d = new FlightPartDO
            {
                From = e.From,
                To = e.To,
                ArrivalTime = e.ArrivalTime,
                DeparatureTime = e.DeparatureTime,
                Airline = e.Airline,
                MinsDuration = e.MinsDuration,
                FlightNo = e.FlightNo
            };

            return d;
        }
    }

    
   

   
}