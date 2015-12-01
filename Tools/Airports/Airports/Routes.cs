using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Airports
{
	public class Routes
	{
		public static void Run()
		{
			var fileName = @"C:\S\Gloobster\Tools\Airports\Airports\routes.dat";
			var routes = ProcessFile(fileName);
			var groups = routes.GroupBy(r =>
			{
				int id = 0;
				//bool isInt = int.TryParse(r.DestinationAirportID, out id);
				bool isInt = int.TryParse(r.SourceAirportID, out id);
				if (isInt)
				{
					return id;
				}

				return 0;
			});
			Dictionary<int, int> res = groups.ToDictionary(r => r.Key, r => r.Count());
			//	.Select(g => new
			//{
			//	Id = g.Key,
			//	Count = g.Count(),
			//}).ToDictionary(r => r.Id);

			//var resOrdered = res.OrderByDescending(r => r.Count).ToList();

			
			var path = @"C:\S\Gloobster\DBScripts\airports2.json";
			var fileText = File.ReadAllText(path);
			var airports = JsonConvert.DeserializeObject<List<Airport>>(fileText).OrderBy(a => a.OrigId);
			foreach (var airport in airports)
			{
				if (res.ContainsKey(airport.OrigId))
				{
					airport.IncomingFlights = res[airport.OrigId];
				}
			}

			var pathToSave = @"C:\S\Gloobster\DBScripts\airports3.json";
			string serAirports2 = JsonConvert.SerializeObject(airports, Formatting.Indented);
			File.WriteAllText(pathToSave, serAirports2);
		}

		public static List<RoutesRaw> ProcessFile(string fileName)
		{
			int counter = 0;
			var routes = new List<RoutesRaw>();

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

					var route = new RoutesRaw
					{
						Airline = p[0],
						AirlineID = p[1],
						SourceAirport = p[2],
						SourceAirportID = p[3],
						DestinationAirport = p[4],
						DestinationAirportID = p[5],
						Codeshare = p[6],
						Stops = p[7],
						Equipment = p[8]						
					};

					routes.Add(route);

					counter++;
				}
			}

			return routes;
		}

	}

	public class RoutesRaw
	{
		public string Airline { get; set; }	//2-letter(IATA) or 3-letter(ICAO) code of the airline.
		public string AirlineID { get; set; }	 //Unique OpenFlights identifier for airline (see Airline).
		public string SourceAirport { get; set; }	//3-letter(IATA) or 4-letter(ICAO) code of the source airport.
		public string SourceAirportID { get; set; } //Unique OpenFlights identifier for source airport(see Airport)
		public string DestinationAirport { get; set; }	//3-letter(IATA) or 4-letter(ICAO) code of the destination airport.
		public string DestinationAirportID { get; set; } //Unique OpenFlights identifier for destination airport(see Airport)
		public string Codeshare { get; set; }	//"Y" if this flight is a codeshare(that is, not operated by Airline, but another carrier), empty otherwise.
		public string Stops { get; set; } // Number of stops on this flight ("0" for direct)
		public string Equipment { get; set; } //3-letter codes for plane type(s) generally used on this flight, separated by spaces
    }
}
