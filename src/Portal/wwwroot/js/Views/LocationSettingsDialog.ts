class LocationSettingsDialog {

 private airTemplate: any;
 private $airportsCont: any;

	constructor() {
		this.registerLocationCombo("currentCity", "CurrentLocation");
		this.registerAirportRange();
		this.airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");
		this.$airportsCont = $("#airportsCont");

		this.initAirports();
	}

	private initAirports() {

		Views.ViewBase.currentView.apiGet("airportRange", null, (airports) => {
			this.generateAirports(airports);
		});

		var airportFrom = new AirportCombo("airportCombo", { clearAfterSelection: true });
		airportFrom.onSelected = (evntData) => {
		 
		 var data = { airportId: evntData.id };
			Views.ViewBase.currentView.apiPost("airportRange", data, (airport) => {
				this.generateAirport(airport);
			});

		}
	}

	private registerLocationCombo(elementId: string, propertyName: string) {

		var c = new PlaceSearchConfig();
		c.providers = "2";
		c.minCharsToSearch = 1;
		c.clearAfterSearch = false;
		c.elementId = elementId;

		var box = new PlaceSearchBox(c);
		box.onPlaceSelected = (request, place) => {
			var data = { propertyName: propertyName, values: { sourceId: request.SourceId, sourceType: request.SourceType } };
			Views.ViewBase.currentView.apiPut("UserProperty", data, (res) => {

			 var $loc = $("#currentLocation");
			 $loc.find("strong").text(place.City);
			 $loc.find("span").text(place.CountryCode);			
			});
		};
	}

  private kmRangeSelected = 200;

	private registerAirportRange() {
		var $comboRoot = $("#airportsRange");
		$comboRoot.click((e) => {
			var $li = $(e.target);
			var val = $li.data("vl");
			this.kmRangeSelected = parseInt(val);
		});

		var $addAirports = $("#addAirports");
		$addAirports.click(() => {

			var data = { distance: this.kmRangeSelected };
			Views.ViewBase.currentView.apiPut("AirportRange", data, (airports) => {
				this.generateAirports(airports);
			});
		});

	}

	private generateAirports(airports) {
		this.$airportsCont.find(".place").remove();

	 airports.forEach((airport) => {
		this.generateAirport(airport);
	 });
	}

  private generateAirport(airport) {
	  var context = { name: airport.selectedName, id: airport.origId };
		var html = this.airTemplate(context);
		var $html = $(html);

	  $html.find(".delete").click((e) => {
		  var id = $(e.target).parent().attr("id");
		  var data = [["id", id]];
		  Views.ViewBase.currentView.apiDelete("AirportRange", data, (airports) => {
			 $("#" + id).remove();
		  });
	  });

	  this.$airportsCont.prepend($html);
  }

}