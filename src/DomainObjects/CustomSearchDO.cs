using System;
using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.DomainObjects
{
    public class CustomSearchDO
    {
        public string Id { get; set; }
        
        public string Name { get; set; }

        public int DaysFrom { get; set; }
        public int DaysTo { get; set; }

        public List<string> CCs { get; set; }
        public List<int> GIDs { get; set; }

        public Date Deparature { get; set; }
        public Date Arrival { get; set; }

        public bool StandardAirs { get; set; }
        public List<FromAirDO> CustomAirs { get; set; }

        public int Freq { get; set; }
        public DateTime? LastNewsletter { get; set; }

        public bool Started { get; set; }
    }

    public class FromAirDO
    {
        public string Text { get; set; }
        public int OrigId { get; set; }
    }

}