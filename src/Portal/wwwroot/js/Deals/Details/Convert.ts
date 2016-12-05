module Planning {

	export interface Flight {
		from: string;
		to: string;
		price: number;
		score: number;
		parts: FlightPart[];


//public int Connections { get; set; }
//public double HoursDuration { get; set; }
//public int DaysInDestination
	}


	export interface FlightPart {
		depTime: Date;
		arrTime: Date;
		from: string;
		to: string;
		airline: string;
		minsDuration: number;
		flightNo: number;
	}

	export class FlightConvert {

		public static cFlights(fs): Flight[] {
			var flights = [];
			fs.forEach((f) => {
				var flight = this.cFlight(f);
				flights.push(flight);
			});
			return flights;
		}

		public static cFlight(f): Flight {
			var flight: Flight = {
				from: f.From,
				to: f.To,
				price: f.Price,
				score: f.FlightScore,
				parts: []
			};

			f.FlightParts.forEach((p) => {
				var part = this.cPart(p);
				flight.parts.push(part);
			});

			return flight;
		}

		public static cPart(p): FlightPart {
			var part: FlightPart = {
				depTime: new Date(p.DeparatureTime),
				arrTime: new Date(p.ArrivalTime),
				from: p.From,
				to: p.To,
				airline: p.Airline,
				minsDuration: p.MinsDuration,
				flightNo: p.FlightNo
			}

			return part;
		}
	}

//public string From { get; set; }
//public string To { get; set; }
//public double Price { get; set; }
//public int Connections { get; set; }
//public double HoursDuration { get; set; }
//public double FlightScore { get; set; }
//public List < FlightPartDO > FlightParts { get; set; }		
//public int DaysInDestination


//public DateTime DeparatureTime { get; set; }
//public DateTime ArrivalTime { get; set; }
//public string From { get; set; }
//public string To { get; set; }
//public string Airline { get; set; }
//public int MinsDuration { get; set; }
//public int FlightNo { get; set; }

}