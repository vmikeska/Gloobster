using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.Portal.ViewModels
{
    public class LinkItemFncs
    {
        public static string GetLinkIco(SourceType type)
        {
            if (type == SourceType.S4)
            {
                return "icon-foursquare";
            }

            if (type == SourceType.FB)
            {
                return "icon-facebook2";
            }

            if (type == SourceType.Yelp)
            {
                return "icon-yelp";
            }

            return string.Empty;
        }

        public static string GetLink(SourceType type, string sid)
        {
            var template = "";

            if (type == SourceType.S4)
            {
                template = "https://foursquare.com/v/{0}";
            }
            if (type == SourceType.FB)
            {
                template = "https://www.facebook.com/{0}";
            }
            if (type == SourceType.Yelp)
            {
                template = "https://www.yelp.com/biz/{0}";
            }

            return string.Format(template, sid);
        }
    }

    public class Table1ViewModel
    {
        public string Title { get; set; }
        public string SubTitle { get; set; }

        public string HtmlId { get; set; }
        
        public List<TableItemVM> TableItems { get; set; }
        public WikiModelBase B { get; set; }
        public ArticleType Type { get; set; }
        public bool ShowButtons { get; set; }
    }

    public enum SectionType { Header, Standard, DosDonts, Links, LayoutCont }

    public class WikiPageBlock
    {
        public WikiModelBase Base { get; set; }
        
        public SectionType Type { get; set; }
        public string SectionType { get; set; }

        public int Rating { get; set; }
        public bool? Liked { get; set; }

        public string Title { get; set; }
        public string Text { get; set; }

        public string ArticleId { get; set; }

        public string PhotoId { get; set; }
 
        public string SectionId { get; set; }
        
        public object Data { get; set; }

        public bool IsEmpty { get; set; }
    }
}