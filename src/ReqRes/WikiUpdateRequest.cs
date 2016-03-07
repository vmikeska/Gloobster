using Gloobster.Enums;

namespace Gloobster.ReqRes
{
    public class WikiUpdateRequest
    {
        public string articleId { get; set; }        
        public string sectionId { get; set; }
        public string language { get; set; }

        public string newText { get; set; }
    }

    public class WikiRatingRequest
    {
        public string articleId { get; set; }
        public string sectionId { get; set; }
        public string language { get; set; }

        public bool like { get; set; }        
    }
}