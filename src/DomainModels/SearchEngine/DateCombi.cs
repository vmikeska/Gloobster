using Gloobster.Common;

namespace Gloobster.DomainModels.SearchEngine
{
    public class DateCombi
    {
        public int Year { get; set; }
        public int WeekNo { get; set; }
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }
}