using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;

namespace Gloobster.DomainModels.SearchEngine
{
    public interface INewAirportCache
    {
        NewAirportEntity GetAirportByAirCode(string code);
        NewAirportEntity GetAirportByGID(int gid);

        List<NewAirportEntity> GetAirportsByCityStarting(string txt);
        List<NewAirportEntity> GetAirportsByAirCodeStarting(string txt);
    }

    public class NewAirportCache: INewAirportCache
    {
        public IDbOperations DB { get; set; }

        public static List<NewAirportEntity> Airports;
        
        public NewAirportEntity GetAirportByGID(int gid)
        {            
            var airport = Airports.FirstOrDefault(a => a.GID == gid);
            if (airport == null)
            {
                return null;
            }
            
            return airport;
        }
        
        public List<NewAirportEntity> GetAirportsByAirCodeStarting(string txt)
        {            
            var ltxt = txt.ToLower();

            var airs = Airports.Where(a => a.Code.ToLower().StartsWith(ltxt)).ToList();
            return airs;
        }

        public List<NewAirportEntity> GetAirportsByCityStarting(string txt)
        {            
            var ltxt = txt.ToLower();

            var airs = Airports.Where(a => a.Name.ToLower().StartsWith(ltxt)).ToList();
            return airs;
        }

        public NewAirportEntity GetAirportByAirCode(string code)
        {            
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
                
            }
        }
    }
}