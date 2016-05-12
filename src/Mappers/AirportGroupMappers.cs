using Gloobster.DomainObjects;
using Gloobster.Entities;

namespace Gloobster.Mappers
{
    //public static class AirportGroupMappers
    //{
    //	public static AirportGroupDO ToDO(this AirportGroupEntity e)
    //	{
    //		var d = new AirportGroupDO
    //		{
    //			CountryCode = e.CountryCode,
    //			City = e.City,
    //			Coord = e.Coord,
    //			GID = e.GID,
    //			Population = e.Population,
    //			AirportIds = e.AirportIds
    //		};
    //		return d;
    //	}

    //}

    public static class NewAirportCityMappers
    {
        public static NewAirportCityDO ToDO(this NewAirportCityEntity e)
        {
            var d = new NewAirportCityDO
            {
                CountryCode = e.CountryCode,
                Name = e.Name,
                GID = e.GID,
                Coord = e.Coord,
                SpId = e.SpId
            };

            if (e.population.HasValue)
            {
                d.Population = e.population.Value;
            }

            return d;
        }

    }


    
}