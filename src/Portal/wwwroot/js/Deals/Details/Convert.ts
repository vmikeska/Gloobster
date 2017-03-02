module Planning {

	export interface Flight {
		from: string;
		to: string;
		price: number;
		score: number;
		bookLink: string;
		parts: FlightPart[];
		stars: number;
		scoreOk: boolean;
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
		
		export class FlightConvert2 {

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
							from: f.from,
							to: f.to,
							price: f.price,
							score: f.score,
							parts: [],
							bookLink: f.bl,
							stars: 0,
							scoreOk: true
					};

					f.parts.forEach((p) => {
							var part = this.cPart(p);
							flight.parts.push(part);
					});

					return flight;
			}

			public static cPart(p): FlightPart {
					var part: FlightPart = {
							depTime: new Date(p.dep),
							arrTime: new Date(p.arr),
							from: p.from,
							to: p.to,
							airline: p.air,
							minsDuration: p.mins,
							flightNo: p.no
					}

					return part;
			}
	}
}