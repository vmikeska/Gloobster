using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.Services
{
	public class AirportGroupService: IAirportGroupService
	{
		public IDbOperations DB { get; set; }

		private List<NewAirportCityEntity> Cities { get; set; }

		public List<NewAirportCityDO> GetCitiesInRange(RectDO rectDO, int? minPopulation)
	    {
			if (Cities == null)
			{                
				Cities = DB.List<NewAirportCityEntity>();
			}

			var citiesInRange = Cities.Where(a =>
			{
			    if (!a.population.HasValue)
			    {
			        return false;
			    }

				if (minPopulation.HasValue)
				{
					bool hasMinPopulation = a.population.Value >= minPopulation.Value;
					if (!hasMinPopulation)
					{
						return false;
					}
				}
				
				bool isInRect = WithinRectangle(rectDO, a.Coord.Lat, a.Coord.Lng);				
				return isInRect;
			}).ToList();
			

		    var citiesInRangeDO = citiesInRange.Select(a => a.ToDO()).ToList();
			
		    return citiesInRangeDO;
	    }

		private bool WithinRectangle(RectDO rectDO, double lat, double lng)
		{
			if (lat > rectDO.LatNorth)
				return false;
			if (lat < rectDO.LatSouth)
				return false;

			if (rectDO.LngEast >= rectDO.LngWest)
				return ((lng >= rectDO.LngWest) && (lng <= rectDO.LngEast));
			else
				return (lng >= rectDO.LngWest);

			return false;
		}

	}
}
