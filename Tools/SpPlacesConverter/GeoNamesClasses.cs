using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Web;

namespace SpPlacesConverter
{
    [DataContract]
    public class CitySearchResponse : GeoNamesResponseBase
    {
        [DataMember(Name = "totalResultsCount")]
        public int TotalResultsCount { get; set; }
        [DataMember(Name = "geonames")]
        public List<GeoName> GeoNames { get; set; }
    }

    [DataContract]
    public class GeoNamesResponseBase
    {
        [DataMember(Name = "status")]
        public ResponseStatus Status { get; set; }

        public bool IsSuccessful => Status != null;
    }

    [DataContract]
    public class ResponseStatus
    {
        [DataMember(Name = "message")]
        public string Message { get; set; }
        [DataMember(Name = "value")]
        public int Value { get; set; }
    }

    [DataContract]
    public class GeoName
    {
        [DataMember(Name = "countryId")]
        public string CountryId { get; set; }
        [DataMember(Name = "adminCode1")]
        public string AdminCode1 { get; set; }
        [DataMember(Name = "countryName")]
        public string CountryName { get; set; }
        [DataMember(Name = "fclName")]
        public string FclName { get; set; }
        [DataMember(Name = "countryCode")]
        public string CountryCode { get; set; }
        [DataMember(Name = "lng")]
        public float Longitude { get; set; }
        [DataMember(Name = "fcodeName")]
        public string FCodeName { get; set; }
        [DataMember(Name = "toponymName")]
        public string ToponymName { get; set; }
        [DataMember(Name = "fcl")]
        public string Fcl { get; set; }
        [DataMember(Name = "name")]
        public string Name { get; set; }
        [DataMember(Name = "fcode")]
        public string FCode { get; set; }
        [DataMember(Name = "geonameId")]
        public int GeonameId { get; set; }
        [DataMember(Name = "lat")]
        public float Latitude { get; set; }
        [DataMember(Name = "adminName1")]
        public string AdminName1 { get; set; }
        [DataMember(Name = "population")]
        public int Population { get; set; }
    }

    public class QueryBuilder
    {
        public Dictionary<string, string> Parameters = new Dictionary<string, string>();
        private bool _withQuestionMark = false;
        private string _endpoint;
        private string _baseUrl;
        private bool _encodeParams = false;

        public string Build()
        {
            var result = string.Empty;

            if (!string.IsNullOrEmpty(_baseUrl))
            {
                result = _baseUrl;
            }

            if (!string.IsNullOrEmpty(_endpoint))
            {
                //todo: path connecting logic
                result += _endpoint;
            }

            var pairedParams = Parameters.Select(p => $"{p.Key}={(_encodeParams ? HttpUtility.UrlEncode(p.Value) : p.Value)}");
            var queryStr = string.Join("&", pairedParams);

            bool hasParams = Parameters.Any();
            if (hasParams)
            {
                result += "?";
                result += queryStr;
            }

            return result;
        }

        public QueryBuilder EncodeParams()
        {
            _encodeParams = true;
            return this;
        }

        public QueryBuilder Param(string key, string value)
        {
            Parameters.Add(key, value);
            return this;
        }

        public QueryBuilder BaseUrl(string baseUrl)
        {
            _baseUrl = baseUrl;
            return this;
        }


        public QueryBuilder Endpoint(string endpoint)
        {
            _endpoint = endpoint;
            return this;
        }

    }

}
