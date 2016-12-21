using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;

namespace Gloobster.DomainModels.SearchEngine
{
    public interface INewAirportCityCache
    {
        void Init(IDbOperations db);
        NewAirportCityEntity GetByGID(int gid);
    }

    public class NewAirportCityCache : INewAirportCityCache
    {
        private List<NewAirportCityEntity> Airports;

        public void Init(IDbOperations db)
        {
            Airports = db.List<NewAirportCityEntity>();
        }

        public NewAirportCityEntity GetByGID(int gid)
        {
            var air = Airports.FirstOrDefault(a => a.GID == gid);
            return air;
        }
        

    }
}