using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;

namespace Gloobster.Portal.Controllers.Portal
{
	public class AirportGroupCreator
	{
		public IDbOperations DB { get; set; }

		

		public void Execute()
		{			
			var airports = DB.C<AirportEntity>().ToList();
			var airportsWithIataFaa = airports.Where(a => a.IataFaa != string.Empty).ToList();
			var airportsGroupedByCity = airportsWithIataFaa.GroupBy(g => g.GeoNamesId).ToList();
			
			int notFoundInCities = 0;
			var airportsGroup = new List<AirportGroupEntity>();
			foreach (var cityGroup in airportsGroupedByCity)
			{
				var cityGroupList = cityGroup.ToList();
				int gid = cityGroup.Key;

				var geoNamesCity = DB.C<CityEntity>().FirstOrDefault(c => c.GID == gid);

				if (geoNamesCity == null)
				{
					notFoundInCities++;
					continue;
				}

				var airportGroup = new AirportGroupEntity
				{
					AirportIds = cityGroupList.Select(c => c.GeoNamesId).ToList(),
					City = geoNamesCity.Name,
					Coord = new LatLng { Lng = geoNamesCity.Coordinates.Lng, Lat = geoNamesCity.Coordinates.Lat },
					CountryCode = geoNamesCity.CountryCode,
					GID = gid,
					Population = geoNamesCity.Population,
					TotalFlights = cityGroupList.Sum(s => s.IncomingFlights)
				};
				airportsGroup.Add(airportGroup);
			}
			
			DB.SaveManyAsync(airportsGroup);
		}
	}
}