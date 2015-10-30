
using Gloobster.DomainObjects;
using Gloobster.Entities;

namespace Gloobster.Mappers
{
	public static class LocationMappers
	{
		public static CityLocationDO ToDO(this CityLocationSE entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new CityLocationDO
			{
				CountryCode = entity.CountryCode,
				City = entity.City,
				GeoNamesId = entity.GeoNamesId
			};

			return dObj;
		}

		public static CityLocationSE ToEntity(this CityLocationDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new CityLocationSE
			{
				CountryCode = dObj.CountryCode,
				City = dObj.City,
				GeoNamesId = dObj.GeoNamesId
			};

			return entity;
		}
	}
}
