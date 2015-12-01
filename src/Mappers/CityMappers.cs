using Gloobster.DomainObjects;
using Gloobster.Entities;

namespace Gloobster.Mappers
{
	public static class CityMappers
	{
		public static CityDO ToDO(this CityEntity e)
		{
			var d = new CityDO
			{
				CountryCode = e.CountryCode,
				Name = e.Name,
				Coordinates = e.Coordinates,
				TimeZone = e.TimeZone,
				GID = e.GID,
				AlternateCountryCode = e.AlternateCountryCode,
				AlternateNames = e.AlternateNames,
				AsciiName = e.AsciiName,
				Elevation = e.Elevation,
				Population = e.Population
			};

			return d;
		}
	}
}