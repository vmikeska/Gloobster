using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.ReqRes.CitiesService;

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

		public static CityResponse ToResponse(this CityDO d)
		{
			if (d == null)
			{
				return null;
			}

			var r = new CityResponse
			{
				alternateCountryCode = d.AlternateCountryCode,
				alternateNames = d.AlternateNames,
				asciiName = d.AsciiName,
				coordinates = d.Coordinates,
				countryCode = d.CountryCode,
				elevation = d.Elevation,
				gid = d.GID,
				name = d.Name,
				population = d.Population,
				timeZone = d.TimeZone
			};
			return r;
		}

		public static CityDO ToDO(this CityResponse r)
		{
			if (r == null)
			{
				return null;
			}

			var d = new CityDO
			{
				AlternateCountryCode = r.alternateCountryCode,
				AlternateNames = r.alternateNames,
				AsciiName = r.asciiName,
				Coordinates = r.coordinates,
				CountryCode = r.countryCode,
				Elevation = r.elevation,
				GID = r.gid,
				Name = r.name,
				Population = r.population,
				TimeZone = r.timeZone
			};
			return d;
		}
	}
}