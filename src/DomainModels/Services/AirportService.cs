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
				var allAirports = DB.List<AirportEntity>();
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
                    City = BuildCityName(a.City, a.CountryCode),
                    AirCode = a.IataFaa,
                    AirName = a.Name                    
                }
			).ToList();
	
			var userIdObj = new ObjectId(userId);

            var ua = DB.FOD<UserAirportsEntity>(u => u.User_id == userIdObj);
		    if (ua == null)
		    {
		        var newUa = new UserAirportsEntity
		        {
		            id = ObjectId.GenerateNewId(),
		            User_id = userIdObj,
		            Airports = airportsEnts
		        };
		        await DB.SaveAsync(newUa);
		    }

            var filter = DB.F<UserAirportsEntity>().Eq(p => p.User_id, userIdObj);
			var update = DB.U<UserAirportsEntity>().Set(p => p.Airports, airportsEnts);

			var res = await DB.UpdateAsync(filter, update);

			List<AirportSaveDO> airportsDOs = airportsEnts.Select(a => a.ToDO()).ToList();
			return airportsDOs;
		}



	    private string BuildCityName(string city, string country)
	    {
	        return $"{city}, {country}";
	    }
        
		public async Task<AirportSaveDO> SaveAirportInRange(string userId, string airportId)
		{
			var airport = DB.FOD<AirportEntity>(a => a.id == new ObjectId(airportId));

		    var saveAirport = new AirportSaveSE
		        {
		            OrigId = airport.OrigId,
		            City = BuildCityName(airport.City, airport.CountryCode),
		            AirCode = airport.IataFaa,
		            AirName = airport.Name
		        };


            var userIdObj = new ObjectId(userId);
			var filter = DB.F<UserAirportsEntity>().Eq(p => p.User_id, userIdObj);
			var update = DB.U<UserAirportsEntity>().Push(p => p.Airports, saveAirport);

			var res = await DB.UpdateAsync(filter, update);

			return saveAirport.ToDO();
		}

		public async Task<bool> RemoveAirportInRange(string userId, int airportOrigId)
		{
			var userIdObj = new ObjectId(userId);
			var ua = DB.FOD<UserAirportsEntity>(u => u.User_id == userIdObj);

			var airportToDelete = ua.Airports.FirstOrDefault(a => a.OrigId == airportOrigId);
			
			var filter = DB.F<UserAirportsEntity>().Eq(p => p.User_id, userIdObj);
			var update = DB.U<UserAirportsEntity>().Pull(p => p.Airports, airportToDelete);

			var res = await DB.UpdateAsync(filter, update);

			return true;
		}

	}	
}