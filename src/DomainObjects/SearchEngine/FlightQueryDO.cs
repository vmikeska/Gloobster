using Gloobster.Common;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightQueryDO
    {
        public string FromPlace { get; set; }
        public string ToPlace { get; set; }

        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }

    public class FlightRecordQueryDO
    {
        public string FromPlace { get; set; }

        public string Id { get; set; }
        public FlightCacheRecordType Type { get; set; }
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }
}