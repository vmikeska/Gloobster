using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.BaseClasses;
using Gloobster.Entities;
using Gloobster.Mappers;
using System.Collections.Generic;
using Gloobster.ReqRes.CitiesService;

namespace Gloobster.DomainModels.Services.GeonamesService
{
	public class GeoNamesService: IGeoNamesService
	{
		private HttpClient _client;

		private LinkQueryBuilder GetLinkBuilderBase()
		{
			var lqb = new LinkQueryBuilder();
			lqb
				.Url("http://citiesservice1.azurewebsites.net")
				.Endpoint("api/City");
			return lqb;
		}

		public GeoNamesService()
		{
			_client = InitClient();
		}

		public async Task<CityDO> GetCityByIdAsync(int id)
		{
			var lqb = GetLinkBuilderBase();
			lqb.Param("id", id);
			var link = lqb.Build();
			var cityResp = await GetResponseAsync<CityResponse>(link);
			var cityDO = cityResp.ToDO();
			return cityDO;
		}
        
        public async Task<List<CityDO>> GetCityAsync(string cityName, string countryCode, int maxRows)
		{
			var lqb = GetLinkBuilderBase();
			lqb.Param("name", cityName);
			lqb.Param("cc", countryCode);
			lqb.Param("r", maxRows);
			var link = lqb.Build();
			var citiesResp = await GetResponseAsync<List<CityResponse>>(link);
			var citiesDO = citiesResp.Select(c => c.ToDO()).ToList();
			return citiesDO;			
		}

		public async Task<List<CityDO>> GetCityQueryAsync(string query, int maxRows)
		{
			var lqb = GetLinkBuilderBase();
			lqb.Param("q", query);			
			lqb.Param("r", maxRows);
			var link = lqb.Build();
			var citiesResp = await GetResponseAsync<List<CityResponse>>(link);
			var citiesDO = citiesResp.Select(c => c.ToDO()).ToList();
			return citiesDO;
		}

		private async Task<T> GetResponseAsync<T>(string link) where T : new()
		{						
			var response = await _client.GetAsync(link);

			if (response.IsSuccessStatusCode)
			{
				string strResponse = await response.Content.ReadAsStringAsync();
				var objResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(strResponse);
				return objResponse;
			}

			return new T();
		}
        
        public async Task<List<CityDO>> GetCityByPopulation(int minPopulation)
        {
            var lqb = GetLinkBuilderBase();
            lqb.Param("mp", minPopulation);            
            var link = lqb.Build();
            var citiesResp = await GetResponseAsync<List<CityResponse>>(link);

            var citiesDO = citiesResp.Select(c => c.ToDO()).ToList();
            return citiesDO;
        }


        private HttpClient InitClient()
		{
			var client = new HttpClient
			{
				//BaseAddress = new Uri(UrlBase)
			};
			client.DefaultRequestHeaders.Accept.Clear();
			client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
			return client;
		}

		public void Dispose()
		{
			_client.Dispose();
		}

	}

    public interface IGeoNamesOnlineService
    {
        Task<List<GeoName>> SearchCities(string query);
    }

    public class GeoNamesOnlineService : IGeoNamesOnlineService
    {
        public async Task<List<GeoName>> SearchCities(string query)
        {
            var qb = new QueryBuilder();
            qb
                .Endpoint("searchJSON")
                //.Param("formatted", "true")
                .Param("formatted", "true")
                .Param("q", query)
                .Param("maxRows", "20")
                .Param("lang", "en")
                .Param("featureClass", "P")
                .Param("orderby", "population");

            var response = await GetResponseAsync<CitySearchResponse>(qb);
            return response.GeoNames;            
        }
        
        public async Task<T> GetResponseAsync<T>(QueryBuilder queryBuilder) where T : new()
        {
            AppendBaseParams(queryBuilder);
            var serviceUrl = queryBuilder.Build();
            
            var response = await _client.GetAsync(serviceUrl);

            if (response.IsSuccessStatusCode)
            {
                string strResponse = await response.Content.ReadAsStringAsync();
                var objResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(strResponse);
                return objResponse;
            }
            
            return new T();
        }

        private void AppendBaseParams(QueryBuilder queryBuilder)
        {
            queryBuilder.Param("username", _userName);
        }

        private HttpClient InitClient()
        {
            var client = new HttpClient { BaseAddress = new Uri(UrlBase) };
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            return client;
        }

        public void Dispose()
        {
            _client.Dispose();
        }

        const string UrlBase = "http://api.geonames.org/";
        private HttpClient _client;
        private string _userName = "gloobster";

        public GeoNamesOnlineService()
        {
            _client = InitClient();
        }

        public void Initialize(string userName)
        {
            _userName = userName;
        }
    }
}


//public async Task<T> GetResponseAsync<T>(QueryBuilder queryBuilder) where T : new()
//{
//	AppendBaseParams(queryBuilder);
//	var serviceUrl = queryBuilder.Build();

//	var response = await _client.GetAsync(serviceUrl);

//	if (response.IsSuccessStatusCode)
//	{
//		string strResponse = await response.Content.ReadAsStringAsync();
//		var objResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(strResponse);
//		return objResponse;
//	}

//	return new T();
//}

//private void AppendBaseParams(QueryBuilder queryBuilder)
//{
//	queryBuilder.Param("username", _userName);
//}

//private HttpClient InitClient()
//{
//	var client = new HttpClient { BaseAddress = new Uri(UrlBase) };
//	client.DefaultRequestHeaders.Accept.Clear();
//	client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
//	return client;
//}

//public void Dispose()
//{
//	_client.Dispose();
//}

//const string UrlBase = "http://api.geonames.org/";
//private HttpClient _client;
//private string _userName = "gloobster";

//public GeoNamesService()
//{
//	_client = InitClient();
//}

//public void Initialize(string userName)
//{
//	_userName = userName;
//}