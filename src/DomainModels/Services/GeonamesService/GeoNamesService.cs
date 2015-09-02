using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Gloobster.DomainModels.Services.GeonamesService
{
	public class GeoNamesService: IGeoNamesService
		//, IDisposable
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

		public async Task<CitySearchResponse> GetCityAsync(string cityName, string countryCode, int maxRows)
		{
			var prms = new Dictionary<string, string>
			{
				{"name", cityName},
				{"country", countryCode},			
				{"maxRows", maxRows.ToString()}
			};

			var cities = await GetResponseAsync<CitySearchResponse>(prms);
			return cities;
		}

		public async Task<CitySearchResponse> GetCityQueryAsync(string query, int maxRows)
		{
			var prms = new Dictionary<string, string>
			{
				{"name", query},
				//{"name_startsWith", query},
				{"maxRows", maxRows.ToString()},
				//{"fuzzy", "0.9" },				
                {"orderby", "population" },
				{"featureClass", "P" }
			};

			var cities = await GetResponseAsync<CitySearchResponse>(prms);
			return cities;
		}

		public async Task<T> GetResponseAsync<T>(Dictionary<string, string> prms) where T: GeoNamesResponseBase
		{
			AppendBaseParams(prms);
			var serviceUrl = BuildUrl(prms);

			HttpResponseMessage response = await _client.GetAsync(serviceUrl);
			if (response.IsSuccessStatusCode)
			{
				string strResponse = await response.Content.ReadAsStringAsync();
				var objResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(strResponse);
				return objResponse;
			}

			return null;
		}

		private void AppendBaseParams(Dictionary<string, string> prms)
		{
			prms.Add("username", _userName);
		}

		private HttpClient InitClient()
		{
			var client = new HttpClient {BaseAddress = new Uri(UrlBase)};
			client.DefaultRequestHeaders.Accept.Clear();
			client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
			return client;
		}

		private string BuildUrl(Dictionary<string, string> prms)
		{
			var serviceName = "searchJSON?";
			var query = string.Join("&", prms.Select(i => $"{i.Key}={i.Value}"));
			var url = serviceName + query;

			return url;
		}

		public void Dispose()
		{
			_client.Dispose();
		}
	}
}