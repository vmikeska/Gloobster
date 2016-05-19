module Planning {
	export class PlanningMap {

		public delayedZoomCallback: DelayedCallbackMap;
		private graph: GraphicConfig;

		public map: any;

		private viewData: any;
		private currentPlanningType: PlanningType;

		public citiesManager: CitiesManager;
		public countriesManager: CountriesManager;

		private weekendForm: WeekendForm;
		private customForm: CustomForm;

		constructor(map) {
			this.map = map;
			this.graph = new GraphicConfig();

			this.citiesManager = new CitiesManager(map, this.graph);
			this.citiesManager.onSelectionChanged = () => this.onSelectionChanged();

			this.countriesManager = new CountriesManager(map, this.graph);
			this.countriesManager.onSelectionChanged = () => this.onSelectionChanged();
			this.citiesManager.countriesManager = this.countriesManager;
			this.countriesManager.citiesManager = this.citiesManager;
		}
			
		public loadCategory(planningType: PlanningType) {
			this.currentPlanningType = planningType;
			this.initCategory();
			this.loadCitiesInRange();
			this.delayedZoomCallback.receiveEvent();
		}

		private loadCitiesInRange() {
			this.delayedZoomCallback = new DelayedCallbackMap();
			this.delayedZoomCallback.callback = () => {
				this.callToLoadCities();
			};

			this.map.on("zoomend", e => {
				this.delayedZoomCallback.receiveEvent();
			});
			this.map.on("moveend", e => {
				this.delayedZoomCallback.receiveEvent();
			});

		}

		private callToLoadCities() {
			var bounds = this.map.getBounds();
			var zoom = this.map.getZoom();
			var population = this.getPopulationFromZoom(zoom);

			var prms = [
				["latSouth", bounds._southWest.lat],
				["lngWest", bounds._southWest.lng],
				["latNorth", bounds._northEast.lat],
				["lngEast", bounds._northEast.lng],
				["minPopulation", population],
				["planningType", this.currentPlanningType.toString()]
			];

			if (this.currentPlanningType === PlanningType.Custom) {
				prms.push(["customId", NamesList.selectedSearch.id]);
			}

			Views.ViewBase.currentView.apiGet("airportGroup", prms, (response) => {
				this.onCitiesResponse(response);
			});
		}

		private initCategory() {

			this.getTabData(this.currentPlanningType, (data) => {

				this.viewData = data;

				if (this.currentPlanningType === PlanningType.Anytime) {
					this.countriesManager.createCountries(this.viewData.countryCodes, this.currentPlanningType);
				}

				if (this.currentPlanningType === PlanningType.Weekend) {
					this.countriesManager.createCountries(this.viewData.countryCodes, this.currentPlanningType);
					this.weekendForm = new WeekendForm(data);
				}

				if (this.currentPlanningType === PlanningType.Custom) {
					var search = this.viewData.searches[0];
					this.countriesManager.createCountries(search.countryCodes, this.currentPlanningType);
					this.customForm = new CustomForm(data, this);
				}

			});
		}

		private getTabData(planningType: PlanningType, callback) {
			var prms = [["planningType", planningType.toString()]];

			Views.ViewBase.currentView.apiGet("PlanningProperty", prms, (response) => {
				callback(response);
			});
		}

		private onCitiesResponse(cities) {
			this.citiesManager.createCities(cities, this.currentPlanningType);
		}

		private getPopulationFromZoom(zoom) {
			if (zoom < 3) {
				return 2000000;
			}
			if (zoom === 3) {
				return 800000;
			}
			if (zoom === 4) {
				return 600000;
			}
			if (zoom === 5) {
				return 400000;
			}
			if (zoom === 6) {
				return 200000;
			}

			if (zoom === 7) {
				return 50000;
			}

			return 1;
		}


			////
		public onSelectionChanged() {
				Views.ViewBase.currentView.apiGet("SearchFlights", [], (flights) => {

					this.generateFlights(flights);

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
				var items = ["FlightScore", "From", "To", "Price", "Connections", "HoursDuration", "FlightPartsStr"];
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