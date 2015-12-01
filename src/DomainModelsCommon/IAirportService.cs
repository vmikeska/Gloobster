using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.DomainObjects;
using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
	public interface IAirportService
	{
		List<AirportDO> GetAirportsInRange(LatLng location, int kmRange);
		Task<AirportSaveDO> SaveAirportInRange(string userId, string airportId);
        Task<List<AirportSaveDO>> SaveAirportsInRange(string userId, List<AirportDO> airports);
		Task<bool> RemoveAirportInRange(string userId, int airportOrigId);
	}
}