using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;

namespace Gloobster.DomainModels.SearchEngine
{
    public interface IOldAirportsCache
    {
        void Init(IDbOperations db);
        AirportEntity GetByOrigId(int origId);
        AirportEntity GetByCode(string code);
    }

    public class OldAirportsCache: IOldAirportsCache
    {
        private List<AirportEntity> Airports;

        public void Init(IDbOperations db)
        {
            Airports = db.List<AirportEntity>();
        }

        public AirportEntity GetByOrigId(int origId)
        {
            var air = Airports.FirstOrDefault(a => a.OrigId == origId);
            return air;
        }

        public AirportEntity GetByCode(string code)
        {
            return Airports.FirstOrDefault(a => a.IataFaa == code);
        }

    }
}