using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Airports
{
	public class RoughConert
	{
		public static void RunConvert()
		{
			var fileName = "airports.dat";
			var roughAirports = ProcessFile(fileName);
			var airports = ParseData(roughAirports);
			ConvertToJson(airports);
		}

		public static void ConvertToJson(List<Airport> airports)
		{
			var fileName = "airports.json";
			var jsonStr = JsonConvert.SerializeObject(airports, Formatting.Indented);
			File.WriteAllText(fileName, jsonStr);
		}

		public static List<Airport> ParseData(List<AirportRow> inputAirports)
		{
			var countryService = new CountryService();

			var outputAirports = new List<Airport>();
			var mc = new List<string>();

			foreach (var inputAirport in inputAirports)
			{
				if (inputAirport.Country == "Korea")
				{
					inputAirport.Country = "North Korea";
				}

				var country = countryService.GetByCountryName(inputAirport.Country);

				if (country == null)
				{
					if (!mc.Contains(inputAirport.Country))
					{
						mc.Add(inputAirport.Country);
					}
				}



				var outputAirport = new Airport
				{
					OrigId = int.Parse(inputAirport.AirportId),
					Name = inputAirport.Name,
					City = inputAirport.City,
					//Country = inputAirport.Country,					
					IataFaa = inputAirport.IataFaa,
					Icao = inputAirport.ICAO,
					Coord = new LatLng
					{
						Lat = float.Parse(inputAirport.Latitude, CultureInfo.InvariantCulture),
						Lng = float.Parse(inputAirport.Longitude, CultureInfo.InvariantCulture)
					},
					Alt = FeetsToMeters(inputAirport.Altitude),
					CountryCode = country.CountryCode
				};


				outputAirports.Add(outputAirport);
			}

			return outputAirports;
		}

		public static int FeetsToMeters(string feetsStr)
		{
			float feetsF = float.Parse(feetsStr, CultureInfo.InvariantCulture);
			float oneFoot = 0.3048f;

			int meters = (int)(feetsF * oneFoot);
			return meters;
		}

		public static List<AirportRow> ProcessFile(string fileName)
		{
			int counter = 0;
			var airports = new List<AirportRow>();

			using (var file = new StreamReader(fileName))
			{
				string line;
				while (true)
				{
					line = file.ReadLine();

					if (string.IsNullOrEmpty(line))
					{
						break;
					}

					var p = line.Replace("\"", string.Empty).Split(',');

					var airport = new AirportRow
					{
						AirportId = p[0],
						Name = p[1],
						City = p[2],
						Country = p[3],
						IataFaa = p[4],
						ICAO = p[5],
						Latitude = p[6],
						Longitude = p[7],
						Altitude = p[8],
						Timezone = p[9],
						DST = p[10],
						TzTimezone = p[11]
					};

					airports.Add(airport);

					counter++;
				}
			}

			return airports;
		}
	}
}
