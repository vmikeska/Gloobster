using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using RestSharp.Authenticators;
using SimpleOAuth;
using YelpSharp;
using EncryptionMethod = System.Security.Cryptography.Xml.EncryptionMethod;

namespace Gloobster.DomainModels.Services.PlaceSearch
{

    public class YelpSearchService : IYelpSearchService
    {                
        private const string ApiHost = "https://api.yelp.com";        
        private const string SearchPath = "/v2/search/";   
        private const string BusinessPath = "/v2/business/";
       
        public YelpSearchResult Search(string term, LatLng coord, int limit)
        {
            try
            {
                string location =
                    $"{coord.Lat.ToString("0.000").Replace(",", ".")},{coord.Lng.ToString("0.000").Replace(",", ".")}";

                string baseURL = ApiHost + SearchPath;
                var queryParams = new Dictionary<string, string>
                {
                    {"term", term},
                    //{"location", location},
                    {"ll", location},
                    {"limit", limit.ToString()}
                };
                JObject res = PerformRequest(baseURL, queryParams);
                var resStr = res.ToString();
                var result = JsonConvert.DeserializeObject<YelpSearchResult>(resStr);
                return result;
            }
            catch (Exception exc)
            {
                return new YelpSearchResult {total = 0, businesses = new List<Business>()};
            }
        }

        public Business GetById(string id)
        {
            string baseURL = ApiHost + BusinessPath + id;
            var res = PerformRequest(baseURL);
            var resStr = res.ToString();
            var result = JsonConvert.DeserializeObject<Business>(resStr);
            return result;
        }


        private JObject PerformRequest(string baseURL, Dictionary<string, string> queryParams = null)
        {
            var query = System.Web.HttpUtility.ParseQueryString(String.Empty);

            if (queryParams == null)
            {
                queryParams = new Dictionary<string, string>();
            }

            foreach (var queryParam in queryParams)
            {
                query[queryParam.Key] = queryParam.Value;
            }

            var uriBuilder = new UriBuilder(baseURL);
            uriBuilder.Query = query.ToString();

            var request = WebRequest.Create(uriBuilder.ToString());
            request.Method = "GET";
            var a = new EncryptionMethod();


            request.SignRequest(
                new Tokens
                {
                    ConsumerKey = GloobsterConfig.YelpConsumerKey,
                    ConsumerSecret = GloobsterConfig.YelpConsumerSecret,
                    AccessToken = GloobsterConfig.YelpAccessToken,
                    AccessTokenSecret = GloobsterConfig.YelpAccessTokenSecret
                }
            ).WithEncryption(SimpleOAuth.EncryptionMethod.HMACSHA1).InHeader();

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            var stream = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            return JObject.Parse(stream.ReadToEnd());
        }

    }


}