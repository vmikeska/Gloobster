using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.Interfaces;

namespace Gloobster.DomainModels.Services.GeonamesService
{
	public class GeoNamesService: IGeoNamesService		
	{
		const string UrlBase = "http://api.geonames.org/";

		private HttpClient _client;
		private string _userName = "gloobster";

		public GeoNamesService()
		{
			_client = InitClient();
		}
		
		public void Initialize(string userName)
		{
			_userName = userName;
		}

		public async Task<GeoNameIdResponse> GetCityByIdAsync(long id)
		{
			var qb = new QueryBuilder();
			qb
				.BaseUrl(UrlBase)
				.Endpoint("getJSON")				
				.Param("geonameId", id.ToString());

			var city = await GetResponseAsync<GeoNameIdResponse>(qb);
			return city;
		}

		public async Task<CitySearchResponse> GetCityAsync(string cityName, string countryCode, int maxRows)
		{
			var qb = new QueryBuilder();
			qb.BaseUrl(UrlBase)
				.Endpoint("searchJSON")
				.Param("name", cityName)
				.Param("country", countryCode)
				.Param("maxRows", maxRows.ToString());
            
			var cities = await GetResponseAsync<CitySearchResponse>(qb);
			return cities;
		}

		public async Task<CitySearchResponse> GetCityQueryAsync(string query, int maxRows)
		{
			var qb = new QueryBuilder();
			qb.BaseUrl(UrlBase)
				.Endpoint("searchJSON")
				.Param("name", query)
				.Param("maxRows", maxRows.ToString())
				.Param("orderby", "population")
				.Param("featureClass", "P");
				//{"name_startsWith", query},				
				//{"fuzzy", "0.9" },				

			var cities = await GetResponseAsync<CitySearchResponse>(qb);
			return cities;
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
			var client = new HttpClient {BaseAddress = new Uri(UrlBase)};
			client.DefaultRequestHeaders.Accept.Clear();
			client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
			return client;
		}

		//private string BuildUrlSearch(string serviceName, Dictionary<string, string> prms)
		//{
		//	var serviceName = "searchJSON?";
		//	var query = string.Join("&", prms.Select(i => $"{i.Key}={i.Value}"));
		//	var url = serviceName + query;

		//	return url;
		//}

		public void Dispose()
		{
			_client.Dispose();
		}
	}
}