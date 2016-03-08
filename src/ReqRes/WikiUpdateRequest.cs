using Gloobster.Enums;
using System.Collections.Generic;

namespace Gloobster.ReqRes
{
    public class UpdateLinkRequest
    {
        public string linkId { get; set; }
        public string articleId { get; set; }
        public string name { get; set; }
        public string category { get; set; }
        public List<SocLinkRequest> socLinks { get; set; }        
    }

    public class DeleteLinkRequest
    {
        public string linkId { get; set; }
        public string articleId { get; set; }       
    }


    public class SocLinkRequest
    {
        public SourceType socNetType { get; set; }
        public string sid { get; set; }
        public string id { get; set; }
    }
			              

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