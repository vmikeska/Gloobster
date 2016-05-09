
module Views {
	export class FlyChatView extends ViewBase {
		
			constructor() {
				super();

				$("#btnCall").click((e) => {
						e.preventDefault();
						this.getResults();
				});
			}

		public getResults() {

			var fromPlace = $("#FromPlace").val();
			var toPlace = $("#ToPlace").val();
			var deparature = $("#Deparature").val();
			var ret = $("#Return").val();

			var directFlight = $("#DirectFlight").val();
			var daysInDestinationFrom = $("#DaysInDestinationFrom").val();
			var typeFlight = $("#TypeFlight").val();
			
			var data = [["FromPlace", fromPlace], ["ToPlace", toPlace], ["Deparature", deparature], ["Return", ret],
					["DirectFlight", directFlight], ["DaysInDestinationFrom", daysInDestinationFrom], ["TypeFlight", typeFlight]];

			this.apiGet("SkypickerTicket", data, (r) => {
					this.generateFlights(r);
			});

		}

		private generateFlights(flights) {
			var $cont = $("#results");
			$cont.html("");

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