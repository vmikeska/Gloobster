using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Mappers;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.DomainModels.Services
{
	public class AirportService : IAirportService
	{
		public IDbOperations DB { get; set; }

		private List<AirportEntity> Airports { get; set; }

		public List<AirportDO> GetAirportsInRange(LatLng location, int kmRange)
		{
			if (Airports == null)
			{
				var allAirports = DB.C<AirportEntity>().ToList();
				Airports = allAirports.Where(a => a.IncomingFlights > 0).ToList();
			}
			
			var fromLocation = new GeoCoordinate(location.Lat, location.Lng);

			var airportsInRange = new List<AirportEntity>();
			foreach (var airport in Airports)
			{
				var airportLocation = new GeoCoordinate(airport.Coord.Lat, airport.Coord.Lng);

				double distanceM = fromLocation.GetDistanceTo(airportLocation);

				int distanceKm = (int)(distanceM/1000);
				if (distanceKm <= kmRange)
				{
					airportsInRange.Add(airport);
				}
			}
			
			var airportsInRangeDO = airportsInRange.Select(a => a.ToDO()).ToList();
			return airportsInRangeDO;
		}

		public async Task<List<AirportSaveDO>> SaveAirportsInRange(string userId, List<AirportDO> airports)
		{
			var airportsEnts = airports.Select(a => 
				new AirportSaveSE
				{
					OrigId = a.OrigId,
                    SelectedName = $"{a.Name}({a.City}, {a.CountryCode}), {a.IataFaa}"
				}
			).ToList();
	
			var userIdObj = new ObjectId(userId);
			var filter = DB.F<PortalUserEntity>().Eq(p => p.id, userIdObj);
			var update = DB.U<PortalUserEntity>().Set(p => p.HomeAirports, airportsEnts);

			var res = await DB.UpdateAsync(filter, update);

			List<AirportSaveDO> airportsDOs = airportsEnts.Select(a => a.ToDO()).ToList();
			return airportsDOs;
		}

		public async Task<AirportSaveDO> SaveAirportInRange(string userId, string airportId)
		{
			var airport = DB.C<AirportEntity>().FirstOrDefault(a => a.id == new ObjectId(airportId));

			var saveAirport = new AirportSaveSE
			{
				OrigId = airport.OrigId,
				SelectedName = $"{airport.Name}({airport.City}, {airport.CountryCode}), {airport.IataFaa}"
			};

			var userIdObj = new ObjectId(userId);
			var filter = DB.F<PortalUserEntity>().Eq(p => p.id, userIdObj);
			var update = DB.U<PortalUserEntity>().Push(p => p.HomeAirports, saveAirport);

			var res = await DB.UpdateAsync(filter, update);

			return saveAirport.ToDO();
		}

		public async Task<bool> RemoveAirportInRange(string userId, int airportOrigId)
		{
			var userIdObj = new ObjectId(userId);
			var user = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);

			var airportToDelete = user.HomeAirports.FirstOrDefault(a => a.OrigId == airportOrigId);
			
			var filter = DB.F<PortalUserEntity>().Eq(p => p.id, userIdObj);
			var update = DB.U<PortalUserEntity>().Pull(p => p.HomeAirports, airportToDelete);

			var res = await DB.UpdateAsync(filter, update);

			return true;
		}

	}	
}