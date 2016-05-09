using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;

namespace Gloobster.Mappers
{
    public static class FlightMappers
    {
        public static FlightDO ToDO(this FlightSE e)
        {
            var d = new FlightDO
            {
                HoursDuration = e.HoursDuration,
                Price = e.Price,
                Stops = e.Stops,
                From = e.From,
                To = e.To
            };

            return d;
        }

        public static FlightSE ToEntity(this FlightDO d)
        {
            var e = new FlightSE
            {
                HoursDuration = d.HoursDuration,
                Price = d.Price,
                Stops = d.Stops,
                From = d.From,
                To = d.To
            };

            return e;
        }
    }
}