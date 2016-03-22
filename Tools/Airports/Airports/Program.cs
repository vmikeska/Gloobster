using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Web.WebSockets;
using Newtonsoft.Json;

//http://openflights.org/

namespace Airports
{
	class Program
	{
		static void Main(string[] args)
		{
		    AddingUSstate.HowManyCitiesOver(10000);
            

		    //ProcessGeoNamesFile();

		    //Routes.Run();
		}

		public static void ProcessGeoNamesFile()
		{
			int counter = 0;
			int cityCounter = 0;
			string line;

			var path = @"C:\S\DBScripts\cities1000.txt";
            var file = new StreamReader(path);

			AppendOutputText("[");
			var errors = new List<string>();
			var batch = new StringBuilder();
			while ((line = file.ReadLine()) != null)
			{
				counter++;

				var prms = line.Split('\t');
				var parsedItem = new GeoNamesParsingItem
				{
					GeonameId = prms[0],
					Name = prms[1],
					AsciiName = prms[2],
					AlternateNames = prms[3],
					Lat = prms[4],
					Lng = prms[5],
					FeatureClass = prms[6],
					FeatureCode = prms[7],
					CountryCode = prms[8],
					AlternateCountryCode = prms[9],
					AdminCode1 = prms[10],
					AdminCode2 = prms[11],
					AdminCode3 = prms[12],
					AdminCode4 = prms[13],
					Population = prms[14],
					Elevation = prms[15],
					DEM = prms[16],
					TimeZone = prms[17],
					ModificationDate = prms[18]
				};

				var city = new GeoNamesCity
				{
					GID = int.Parse(parsedItem.GeonameId),
					CountryCode = parsedItem.CountryCode,
					AlternateCountryCode = parsedItem.AlternateCountryCode,
					AsciiName = parsedItem.AsciiName,
					Elevation = parsedItem.Elevation,
					Name = parsedItem.Name,
					TimeZone = parsedItem.TimeZone,
					Population = parsedItem.Population,
					AlternateNames = parsedItem.AlternateNames,
					Coordinates = new LatLng
					{
						Lat = float.Parse(parsedItem.Lat, CultureInfo.InvariantCulture),
						Lng = float.Parse(parsedItem.Lng, CultureInfo.InvariantCulture)
					}
				};
				
				if (parsedItem.FeatureClass == "P")
				{
					try
					{
						var cityStr = JsonConvert.SerializeObject(city);
						batch.Append(cityStr);
						batch.Append(",");
						batch.Append(Environment.NewLine);
					}
					catch (Exception)
					{
						errors.Add(city.GID.ToString());					
					}
					
					cityCounter++;
				}

				if ((cityCounter > 0) && (cityCounter % 1000) == 0)
				{
					var batchText = batch.ToString();
					AppendOutputText(batchText);
					batch = new StringBuilder();
				}

				if ((counter%100000) == 0)
				{
					Console.WriteLine(counter);
				}
			}


			var batchText2 = batch.ToString();
			var batchTextLast = batchText2.TrimEnd().Substring(0, batchText2.Length - 3);
			AppendOutputText(batchTextLast);
			AppendOutputText("]");

			file.Close();

			Console.WriteLine("Cities: " + cityCounter);

			
			// Suspend the screen.
			Console.ReadLine();
		}

		public static void AppendOutputText(string line)
		{
			var outPath = @"C:\S\DBScripts\Cities1000.json";

			using (var sw = File.AppendText(outPath))
			{
				sw.WriteLine(line);				
			}
		}

		
	}

	public class GeoNamesCity
	{
		public int GID { get; set; }
		public string Name { get; set; }
		public string AsciiName { get; set; }
		public string AlternateNames { get; set; }
		public LatLng Coordinates { get; set; }		
		public string CountryCode { get; set; }
		public string AlternateCountryCode { get; set; }		
		public string Population { get; set; }
		public string Elevation { get; set; }		
		public string TimeZone { get; set; }		
	}

	public class GeoNamesParsingItem
	{
		public string GeonameId { get; set; }
		public string Name { get; set; }
		public string AsciiName { get; set; }
		public string AlternateNames { get; set; }
		public string Lat { get; set; }
		public string Lng { get; set; }
		public string FeatureClass { get; set; }
		public string FeatureCode { get; set; }
		public string CountryCode { get; set; }
		public string AlternateCountryCode { get; set; }
		public string AdminCode1 { get; set; }
		public string AdminCode2 { get; set; }
		public string AdminCode3 { get; set; }
		public string AdminCode4 { get; set; }
		public string Population { get; set; }
		public string Elevation { get; set; }
		public string DEM { get; set; }
		public string TimeZone { get; set; }
		public string ModificationDate { get; set; }
	}

	


}
