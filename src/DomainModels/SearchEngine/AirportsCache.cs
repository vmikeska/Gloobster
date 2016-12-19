using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;

namespace Gloobster.DomainModels.SearchEngine
{
    public interface IAirportsCache
    {
        NewAirportEntity GetAirportByAirCode(string code);
        NewAirportEntity GetAirportByGID(int gid);
    }

    public class AirportsCache: IAirportsCache
    {
        public IDbOperations DB { get; set; }

        public static List<NewAirportEntity> Airports;
        
        public NewAirportEntity GetAirportByGID(int gid)
        {
            InitDB();

            var airport = Airports.FirstOrDefault(a => a.GID == gid);
            if (airport == null)
            {
                return null;
            }
            
            return airport;
        }

        public NewAirportEntity GetAirportByAirCode(string code)
        {
            InitDB();

            var airport = Airports.FirstOrDefault(a => a.Code == code);
            if (airport == null)
            {
                return null;
            }

            if (airport.GID == 0)
            {
                return null;
            }

            return airport;
        }

        private void InitDB()
        {
            if (Airports == null)
            {
                Airports = DB.List<NewAirportEntity>();
            }
        }
    }
}