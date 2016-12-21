using System.Collections.Generic;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class SearchParams
    {
        public string to_type { get; set; }
        public string flyFrom_type { get; set; }
        public Seats seats { get; set; }
    }
    
    public class Seats
    {
        public int infants { get; set; }
        public int passengers { get; set; }
        public int adults { get; set; }
        public int children { get; set; }
    }

    

    public class Duration
    {
        public int total { get; set; }
        public int @return { get; set; }
        public int departure { get; set; }
    }

    public class Conversion
    {
        public int EUR { get; set; }
    }

    public class CountryTo
    {
        public string code { get; set; }
        public string name { get; set; }
    }

    public class Baglimit
    {
        public int hand_width { get; set; }
        public int hand_length { get; set; }
        public int hold_weight { get; set; }
        public int hand_height { get; set; }
        public int hand_weight { get; set; }
    }

    public class BagsPrice
    {
        public int __invalid_name__1 { get; set; }
        public int __invalid_name__2 { get; set; }
    }

    public class CountryFrom
    {
        public string code { get; set; }
        public string name { get; set; }
    }

    public class Route
    {
        public bool bags_recheck_required { get; set; }
        public string mapIdfrom { get; set; }
        public int flight_no { get; set; }
        public int original_return { get; set; }
        public double lngFrom { get; set; }
        public string flyTo { get; set; }
        public string mapIdto { get; set; }
        public string id { get; set; }
        public string source { get; set; }
        public double latFrom { get; set; }
        public double lngTo { get; set; }
        public int dTimeUTC { get; set; }
        public int aTimeUTC { get; set; }
        public int @return { get; set; }
        public int price { get; set; }
        public string cityTo { get; set; }
        public string flyFrom { get; set; }
        public double latTo { get; set; }
        public int dTime { get; set; }
        public string found_on { get; set; }
        public string airline { get; set; }
        public string cityFrom { get; set; }
        public int aTime { get; set; }
    }

    public class KiwiFlightSearchResult
    {
        public string mapIdfrom { get; set; }
        public bool refr { get; set; }
        public Duration duration { get; set; }
        public string return_duration { get; set; }
        public string flyTo { get; set; }
        public Conversion conversion { get; set; }
        public string deep_link { get; set; }
        public string mapIdto { get; set; }
        public int nightsInDest { get; set; }
        public string id { get; set; }
        public bool facilitated_booking_available { get; set; }
        public string fly_duration { get; set; }
        public CountryTo countryTo { get; set; }
        public Baglimit baglimit { get; set; }
        public int aTimeUTC { get; set; }
        public int p3 { get; set; }
        public int price { get; set; }
        public List<string> type_flights { get; set; }
        public BagsPrice bags_price { get; set; }
        public string cityTo { get; set; }
        public string flyFrom { get; set; }
        public int dTimeUTC { get; set; }
        public int p2 { get; set; }
        public CountryFrom countryFrom { get; set; }
        public List<object> hidden_flights { get; set; }
        public int p1 { get; set; }
        public int dTime { get; set; }
        public string booking_token { get; set; }
        public string cityFrom { get; set; }
        public int aTime { get; set; }
        public List<Route> route { get; set; }
        public double distance { get; set; }
    }

    public class SearchResultRoot
    {
        public List<object> connections { get; set; }
        public string currency { get; set; }
        public object del { get; set; }
        public int time { get; set; }
        public SearchParams search_params { get; set; }
        public int currency_rate { get; set; }
        public List<KiwiFlightSearchResult> data { get; set; }
        public double distance { get; set; }
    }

}