using Gloobster.Common;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightQueryDO
    {
        public string FromPlace { get; set; }
        public string ToPlace { get; set; }

        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }
}