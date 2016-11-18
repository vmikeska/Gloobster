module Planning {
	export class PlanningMap {

		public onSelectionChanged: Function;		
		public onMapLoaded: Function;

		public delayedZoomCallback: DelayedCallbackMap;

		public map: Map;

		private viewData: any;
		private planningType: PlanningType;
		private viewType = FlightCacheRecordType.Country;

		public citiesManager: CitiesManager;

		//dont delete
		//private customForm: CustomForm;

		private resultsEngine: ResultsManager;

		constructor() {
			this.initMap();

			this.initCountriesFnc();

			this.initCitiesFnc();
		}

		public changeViewType(type: FlightCacheRecordType) {
				this.viewType = type;
				this.displayMapData();
		}

		private initMap() {
					this.map = new Map();
					this.map.init("map");

					this.map.onMapLoaded = () => {
							this.loadCategory(PlanningType.Anytime);
							this.onMapLoaded();
					}
		}

		private initCountriesFnc() {
			this.map.onCountryChange = (cc, isSelected) => {
				this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);

				var data = PlanningSender.createRequest(this.planningType,
					"countries",
					{
						countryCode: cc,
						selected: isSelected
					});

				PlanningSender.updateProp(data,
					(response) => {
					});
			};
		}

		private initCitiesFnc() {
			
			this.citiesManager = new CitiesManager(this.map.mapObj);

			this.citiesManager.onSelectionChanged = (id, newState, type) => {
				this.onSelectionChanged(id, newState, type);
			}
		}

		public loadCategory(pt: PlanningType) {
			this.planningType = pt;
			this.initData();								
		}

		private initData() {

			this.getTabData(this.planningType,
				(data) => {

					this.viewData = data;

					this.displayMapData();

					//do not delete
					//if (this.planningType === PlanningType.Custom) {
					//		var search = this.viewData.searches[0];
					//		this.countriesManager.createCountries(search.countryCodes, this.planningType);
					//		this.customForm = new CustomForm(data, this);
					//}

				});
		}

		private displayMapData() {
			if (this.viewType === FlightCacheRecordType.Country) {
				this.map.setCountries(this.viewData.countryCodes);
			} else {
				this.loadCitiesInRange();
				this.delayedZoomCallback.receiveEvent();
			}
		}

		private getTabData(planningType: PlanningType, callback) {
			var prms = [["planningType", planningType.toString()]];

			Views.ViewBase.currentView.apiGet("PlanningProperty", prms, (response) => {
					callback(response);
				});
		}

		private loadCitiesInRange() {
			this.delayedZoomCallback = new DelayedCallbackMap();
			this.delayedZoomCallback.callback = () => {
				this.callToLoadCities();
			};

			this.map.mapObj.on("zoomend", e => {
				this.delayedZoomCallback.receiveEvent();
			});
			this.map.mapObj.on("moveend", e => {
				this.delayedZoomCallback.receiveEvent();
			});

		}

		private callToLoadCities() {
			var bounds = this.map.mapObj.getBounds();
			var zoom = this.map.mapObj.getZoom();
			var population = this.getPopulationFromZoom(zoom);

			var prms = [
				["latSouth", bounds._southWest.lat],
				["lngWest", bounds._southWest.lng],
				["latNorth", bounds._northEast.lat],
				["lngEast", bounds._northEast.lng],
				["minPopulation", population.toString()],
				["planningType", this.planningType.toString()]
			];

			//dont delete
			//if (this.planningType === PlanningType.Custom) {
			//	prms.push(["customId", NamesList.selectedSearch.id]);
			//}

			Views.ViewBase.currentView.apiGet("airportGroup", prms, (response) => {
				this.onCitiesResponse(response);
			});
		}
			
		private onCitiesResponse(cities) {
			this.citiesManager.createCities(cities, this.planningType);
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

		}

}