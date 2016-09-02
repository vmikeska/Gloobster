using Gloobster.Enums;
using System.Collections.Generic;

namespace Gloobster.ReqRes
{
    public class UpdateConfirmedRequest
    {
        public string articleId { get; set; }
        public string photoId { get; set; }
    }

    public class PermissionRequest
    {        
        public string id { get; set; }
    }

    public class PermissionArticleRequest
    {
        public string userId { get; set; }
        public string articleId { get; set; }
    }

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

    public class UpdatePriceRequest
    {
        public string priceId { get; set; }
        public string articleId { get; set; }
        public decimal price { get; set; }
    }

    public class ReportRequest
    {
        public string lang { get; set; }
        public string articleId { get; set; }
        public string sectionId { get; set; }
        public string text { get; set; }
    }

    public class AdminActionRequest
    {
        public string action { get; set; }
        public string id { get; set; }
    }

    public class UpdateDoDontRequest
    {
        public string articleId { get; set; }        
        public string language { get; set; }
        public string id { get; set; }
        public string text { get; set; }
        public string type { get; set; }
    }

    public class VersionRequest
    {
        public string articleId { get; set; }
        public string lang { get; set; }
        public string addId { get; set; }
        public int position { get; set; }
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

    public class WikiPriceRatingRequest
    {
        public string articleId { get; set; }
        public string priceId { get; set; }

        public bool plus { get; set; }
    }

    public class WikiSearchResult
    {
        public string title { get; set; }
        public string id { get; set; }
        public string language { get; set; }
        public string link { get; set; }
        public string articleId { get; set; }
        public double rating { get; set; }
    }
}