using System.Collections.Generic;

namespace Gloobster.DomainObjects
{
    public class Span
    {
        public double latitude_delta { get; set; }
        public double longitude_delta { get; set; }
    }

    public class Center
    {
        public double latitude { get; set; }
        public double longitude { get; set; }
    }

    public class Region
    {
        public Span span { get; set; }
        public Center center { get; set; }
    }

    public class Coordinate
    {
        public double latitude { get; set; }
        public double longitude { get; set; }
    }

    public class Location
    {
        public string city { get; set; }
        public List<string> display_address { get; set; }
        public double geo_accuracy { get; set; }
        public List<string> neighborhoods { get; set; }
        public string postal_code { get; set; }
        public string country_code { get; set; }
        public List<string> address { get; set; }
        public Coordinate coordinate { get; set; }
        public string state_code { get; set; }
    }

    public class Business
    {
        public bool is_claimed { get; set; }
        public double rating { get; set; }
        public string mobile_url { get; set; }
        public string rating_img_url { get; set; }
        public int review_count { get; set; }
        public string name { get; set; }
        public string snippet_image_url { get; set; }
        public string rating_img_url_small { get; set; }
        public string url { get; set; }
        public List<List<string>> categories { get; set; }
        public string phone { get; set; }
        public string snippet_text { get; set; }
        public string image_url { get; set; }
        public Location location { get; set; }
        public string display_phone { get; set; }
        public string rating_img_url_large { get; set; }
        public string id { get; set; }
        public bool is_closed { get; set; }
        public double distance { get; set; }
    }

    public class YelpSearchResult
    {
        public Region region { get; set; }
        public int total { get; set; }
        public List<Business> businesses { get; set; }
    }
}
