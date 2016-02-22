using System;
using System.Net;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;
using YelpSharp;

namespace Gloobster.DomainModels.Services.PlaceSearch
{
    public class YelpSearchService: IYelpSearchService
    {
        const string RootUri = "http://api.yelp.com/v2/";
        const string EndpointSearch = "search";
        const string EndpointGet = "business";
        private RestClient Client;

        public YelpSearchService()
        {
            var options = new Options
            {
                AccessToken = GloobsterConfig.YelpAccessToken,
                AccessTokenSecret = GloobsterConfig.YelpAccessTokenSecret,
                ConsumerKey = GloobsterConfig.YelpConsumerKey,
                ConsumerSecret = GloobsterConfig.YelpConsumerSecret
            };
            
            Client = new RestClient(RootUri)
            {
                Authenticator = OAuth1Authenticator.ForProtectedResource(options.ConsumerKey, options.ConsumerSecret, 
                    options.AccessToken, options.AccessTokenSecret)
            };
        }

        public async Task<Business> GetById(string id)
        {
            var query = $"{EndpointGet}/{id}";
            var request = new RestRequest(query, Method.GET);
            
            var tcs = new TaskCompletionSource<dynamic>();          
            var handle = Client.ExecuteAsync(request, response =>
            {
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    tcs.SetResult(default(Business));
                }
                else
                {
                    try
                    {
                        var results = JsonConvert.DeserializeObject<Business>(response.Content);
                        tcs.SetResult(results);
                    }
                    catch (Exception ex)
                    {
                        tcs.SetException(ex);
                    }
                }
            });
           

            return await tcs.Task;
        }

        public async Task<YelpSearchResult> Search(string term, LatLng coord)
        {
            var request = new RestRequest(EndpointSearch, Method.GET);

            request.AddParameter("term", term);
            request.AddParameter("radius_filter", 40000);
            request.AddParameter("limit", 10);
            request.AddParameter("ll", $"{coord.Lat.ToString("0.000").Replace(",", ".")},{coord.Lng.ToString("0.000").Replace(",", ".")}");
            
            var tcs = new TaskCompletionSource<YelpSearchResult>();            
            var handle = Client.ExecuteAsync(request, response =>
            {
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    tcs.SetResult(new YelpSearchResult {total = 0});
                }
                else
                {
                    try
                    {
                        var results = JsonConvert.DeserializeObject<YelpSearchResult>(response.Content);
                        tcs.SetResult(results);
                    }
                    catch (Exception ex)
                    {
                        tcs.SetException(ex);
                    }
                }
            });
            
            return await tcs.Task;
        }
    }
}