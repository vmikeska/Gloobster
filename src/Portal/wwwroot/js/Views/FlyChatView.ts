
module Views {
	export class FlyChatView extends ViewBase {
		
			constructor() {
				super();

				this.generateUi();

				$("#btnCall").click((e) => {
						e.preventDefault();
						this.getResults();
				});
			}

		public generateUi() {
			var fields = [
					{ name: "flyFrom", valuesRange: [], defaultValue: "FRA", cap: "Skypicker api id of the departure destination. Accepts the list of airport codes, city ID, two letter country code or metropolitan coded. For multicity search enter any number of values separated by comma. E.g. LON - checks every airport in London, LHR - checks flights from London Heathrow, UK - flights from United Kingdom Example: CZ." },
					{ name: "dateFrom", valuesRange: [], defaultValue: "7/01/2017", cap: "search flights from this date (dd/mm/YYYY). Use parameters dateFrom and dateTo as a daterange for the flight departure. Parameter dateFrom 01/05/2016 and dateTo 30/05/2016 means, that the departure can be anytime between those dates. For the dates of the return flights, use the returnTo&returnFrom or daysInDestinationFrom & daysInDestinationTo parameters Example: 08/02/2016." },
					{ name: "dateTo", valuesRange: [], defaultValue: "17/01/2017", cap: "search flights until this date (dd/mm/YYYY) Example: 08/03/2016." },

					{ name: "to", valuesRange: [], defaultValue: "LON", cap: "Skypicker api id of the arrival destination. Can also accept a list of airport codes separated by a comma for multicity search. E.g. BRQ,PRG,BTS,BUD. If you don't include any value you'll get results for all the airports in the world. Example: porto." },

					{ name: "oneforcity", valuesRange: ["0", "1"], defaultValue: "", cap: "filters out the cheapest flights to every city covered by the to parameter. E.g. if you set it to 1 and your search is from PRG to LON/BUD/NYC, you'll get 3 results: the cheapest PRG-LON, the cheapest PRG-BUD, and the cheapest PRG-NYC. Example: 0." },
					{ name: "daysInDestinationFrom", valuesRange: [], defaultValue: "", cap: "the minimal length of stay in the destination given in the to parameter. Counts nights, not days Example: 2." },
					{ name: "daysInDestinationTo", valuesRange: [], defaultValue: "", cap: "the max length of stay in the destination given in the to parameter (use only one from the daysInDestination and returnFrom/returnTo parameters. If both of them are given, the API uses the daysInDest parameters and the return dates are ignored). When you omit one of these two params, the default value for daysInDestinationFrom is 1 and for daysInDestinationTo is 14. Example: 14." },
					
					{ name: "typeFlight", valuesRange: ["oneway", "round"], defaultValue: "", cap: "switch for oneway/round flights search - will be deprecated in the near future (until then, you have to use the round parameter if one from the daysInDestination of returndate parameters is given.) Example: oneway. Possible values:  round , oneway ." },
					{ name: "directFlights", valuesRange: ["0", "1"], defaultValue: "", cap: "search only for direct flights, can be set to 0 or 1, 0 is default Example: 0." },
					{ name: "onlyWeekends", valuesRange: ["0", "1"], defaultValue: "", cap: "search flights with departure only on weekends Example: 0." },
					{ name: "one_per_date", valuesRange: ["0", "1"], defaultValue: "", cap: "filters out the cheapest flights for one date. Can be 0 or not included, or one of these two params can be set to 1 Example: 0." },
					{ name: "flyDays-mustimplement", valuesRange: [], defaultValue: "", cap: "" },

					{ name: "price_from", valuesRange: [], defaultValue: "", cap: "" },
					{ name: "price_to", valuesRange: [], defaultValue: "", cap: "" },

					{ name: "returnFrom", valuesRange: [], defaultValue: "", cap: "min return of the whole trip (dd/mm/YYYY) Example: 08/02/2016." },
					{ name: "returnTo", valuesRange: [], defaultValue: "", cap: "max return date of the whole trip (dd/mm/YYYY) Example: 08/02/2016." },

					{ name: "passengers", valuesRange: [], defaultValue: "", cap: "number of passengers. Default for defining the num of passengers. Example: 1." }
			];

			var $theTable = $("#theTable");

			fields.forEach((f) => {
				var $tr = $("<tr></tr>");
				var name = f.name;
				if (f.valuesRange.length > 0) {
					name += `(${f.valuesRange.join("/")})`;
				}
				var $cap = $(`<td>${name}</td>`);
				$tr.append($cap);

				var $input = `<td><input id="${f.name}" type="text" value="${f.defaultValue}" /></td>`;
				$tr.append($input);
					
				var $des = $(`<td>${f.cap}</td>`);
				$tr.append($des);

				$theTable.append($tr);
			});
		}

		public getResults() {

				var $theTable = $("#theTable");
				var $inputs = $theTable.find("input");

				var data = [];

			$inputs.toArray().forEach((i) => {
				var $i = $(i);
				var val = $i.val();				
				data.push([$i.attr("id"), val]);				
			});


			this.clearRes();
			this.apiGet("SkypickerTicket", data, (r) => {
					this.generateFlights(r);
			});

		}

			private clearRes() {
					var $cont = $("#results");
					$cont.html("");
			}

		private generateFlights(flights) {
			var $cont = $("#results");
			this.clearRes();

			flights.forEach((flight) => {
				var $flight = this.generateFlight(flight);
				$cont.append($flight);
			});				
		}

		private generateFlight(flight) {
			var $base = $(`<table></table>`);
			var items = ["From", "To", "Price", "Stops", "HoursLength", "FlightPartsStr"];
			items.forEach((item) => {
				var $item = this.generateItem(flight, item);
				$base.append($item);
			});
			return $base;
		}

		private generateItem(flight, name) {
				return $(`<tr><td>${name}</td><td>${flight[name]}</td></tr>`);
		}


	}
}