using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Airports
{
	public class ToolsForGettingGeoNamesId
	{
		private static void Join()
		{
			var idFile = @"C:\S\Gloobster\DBScripts\airportsCity.txt";
			var idFileText = File.ReadAllText(idFile);

			var idItems = idFileText.Split(new[] { Environment.NewLine }, StringSplitOptions.None).ToList();

			var dict = new Dictionary<int, int>();
			idItems.ForEach(i =>
			{
				var prms = i.Split(new[] { "||" }, StringSplitOptions.None);
				var airportId = int.Parse(prms.First());
				var geonamesId = int.Parse(prms.Last());

				if (dict.ContainsKey(airportId))
				{
					var val = dict[airportId];

				}
				else
				{
					dict.Add(airportId, geonamesId);
				}

			});


			var path = @"C:\S\Gloobster\DBScripts\airports.json";
			var fileText = File.ReadAllText(path);
			var airports = JsonConvert.DeserializeObject<List<Airport>>(fileText).OrderBy(a => a.OrigId);
			foreach (var airport in airports)
			{

				if (dict.ContainsKey(airport.OrigId))
				{
					int gnid = dict[airport.OrigId];
					airport.GeoNamesId = gnid;
				}
			}

			var pathToSave = @"C:\S\Gloobster\DBScripts\airports2.json";
			string serAirports2 = JsonConvert.SerializeObject(airports, Formatting.Indented);
			File.WriteAllText(pathToSave, serAirports2);
		}

		private static async void Execute()
		{
			var path = @"C:\S\Gloobster\DBScripts\airports.json";
			var outPath = @"C:\S\Gloobster\DBScripts\airportsCity.txt";
			var fileText = File.ReadAllText(path);
			var airports = JsonConvert.DeserializeObject<List<Airport>>(fileText).OrderBy(a => a.OrigId);
			//var service = new GeoNamesService();

			foreach (var airport in airports)
			{
				if (airport.OrigId > 4175)

					try
					{
						var cityRes = GetCity(airport.City, airport.CountryCode);
						//await service.GetCityAsync(airport.City, airport.CountryCode, 1);

						var gonameId = cityRes.GeoNames.First().GeonameId;

						using (StreamWriter sw = File.AppendText(outPath))
						{
							var line = $"{airport.OrigId}||{gonameId}";
							sw.WriteLine(line);
							Console.WriteLine(line);
						}
					}
					catch (Exception exc)
					{
						Console.WriteLine("error");
					}
			}
		}

		private static CitySearchResponse GetCity(string cityName, string countryCode)
		{

			var qb = new QueryBuilder();
			qb.BaseUrl("http://api.geonames.org/")
				.Endpoint("searchJSON")
				.Param("username", "gloobster")
				.Param("name", cityName)
				.Param("country", countryCode)
				.Param("maxRows", "1");

			var url = qb.Build();

			WebRequest request = WebRequest.Create(url);
			// If required by the server, set the credentials.
			request.Credentials = CredentialCache.DefaultCredentials;

			WebResponse response = request.GetResponse();

			//Console.WriteLine(((HttpWebResponse)response).StatusDescription);

			Stream dataStream = response.GetResponseStream();

			StreamReader reader = new StreamReader(dataStream);

			string responseFromServer = reader.ReadToEnd();
			var objResponse = JsonConvert.DeserializeObject<CitySearchResponse>(responseFromServer);

			reader.Close();
			response.Close();

			return objResponse;
		}
	}
}
