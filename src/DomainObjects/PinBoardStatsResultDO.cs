using System.Collections.Generic;

namespace Gloobster.DomainObjects
{
    public class PinBoardStatsResultDO
    {
        public int CitiesCount { get; set; }
        public int CountriesCount { get; set; }
        public int WorldTraveledPercent { get; set; }
        public int StatesCount { get; set; }

        public List<int> EuropeCities { get; set; }
        public List<int> AsiaCities { get; set; }
        public List<int> NorthAmericaCities { get; set; }
        public List<int> SouthAmericaCities { get; set; }
        public List<int> AfricaCities { get; set; }
        public List<int> AustraliaCities { get; set; }

        public List<string> CountryCodes { get; set; }
        public List<string> StateCodes { get; set; }
    }
}