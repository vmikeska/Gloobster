using Gloobster.DomainObjects;
using Gloobster.Entities;

namespace Gloobster.Mappers
{
	public static class AirportGroupMappers
	{
		public static AirportGroupDO ToDO(this AirportGroupEntity e)
		{
			var d = new AirportGroupDO
			{
				CountryCode = e.CountryCode,
				City = e.City,
				Coord = e.Coord,
				GID = e.GID,
				Population = e.Population,
				AirportIds = e.AirportIds
			};
			return d;
		}
	}
}