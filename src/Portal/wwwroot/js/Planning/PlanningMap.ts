module Planning {
	export class PlanningMap {

		public onSelectionChanged: Function;		
		public onMapLoaded: Function;

		public delayedZoomCallback: DelayedCallbackMap;
		private graph: GraphicConfig;

		public map: Map;

		private viewData: any;
		private planningType: PlanningType;

		public citiesManager: CitiesManager;
			
		private customForm: CustomForm;

		private resultsEngine: ResultsManager;

		constructor() {
				this.map = new Map();
				this.map.init("map");

				this.map.onCountryChange = (cc, isSelected) => {						
						this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);

						var data = PlanningSender.createRequest(this.planningType, "countries", {
								countryCode: cc,
								selected: isSelected
						});

						PlanningSender.updateProp(data, (response) => {								
						});						
				};

				this.map.onMapLoaded = () => {
						this.loadCategory(PlanningType.Anytime);
						this.onMapLoaded();
				}


			//this.graph = new GraphicConfig();
			//this.citiesManager = new CitiesManager(map, this.graph);
			//this.citiesManager.onSelectionChanged = (id, newState, type) => this.onSelectionChanged(id, newState, type);				
			//this.citiesManager.countriesManager = this.countriesManager;			
		}
			

		public loadCategory(pt: PlanningType) {
			this.planningType = pt;
			this.initCountries();				


			//this.loadCitiesInRange();
			//this.delayedZoomCallback.receiveEvent();				
		}

		private initCountries() {

			this.getTabData(this.planningType,
				(data) => {

					this.viewData = data;

					this.map.setCountries(this.viewData.countryCodes);

					//do not delete
					//if (this.planningType === PlanningType.Custom) {
					//		var search = this.viewData.searches[0];
					//		this.countriesManager.createCountries(search.countryCodes, this.planningType);
					//		this.customForm = new CustomForm(data, this);
					//}

				});
		}

		private getTabData(planningType: PlanningType, callback) {
				var prms = [["planningType", planningType.toString()]];

				Views.ViewBase.currentView.apiGet("PlanningProperty", prms, (response) => {
						callback(response);
				});
		}

		//private loadCitiesInRange() {
		//	this.delayedZoomCallback = new DelayedCallbackMap();
		//	this.delayedZoomCallback.callback = () => {
		//		this.callToLoadCities();
		//	};

		//	this.map.on("zoomend", e => {
		//		this.delayedZoomCallback.receiveEvent();
		//	});
		//	this.map.on("moveend", e => {
		//		this.delayedZoomCallback.receiveEvent();
		//	});

		//}

		//private callToLoadCities() {
		//	var bounds = this.map.getBounds();
		//	var zoom = this.map.getZoom();
		//	var population = this.getPopulationFromZoom(zoom);

		//	var prms = [
		//		["latSouth", bounds._southWest.lat],
		//		["lngWest", bounds._southWest.lng],
		//		["latNorth", bounds._northEast.lat],
		//		["lngEast", bounds._northEast.lng],
		//		["minPopulation", population],
		//		["planningType", this.currentPlanningType.toString()]
		//	];

		//	if (this.currentPlanningType === PlanningType.Custom) {
		//		prms.push(["customId", NamesList.selectedSearch.id]);
		//	}

		//	Views.ViewBase.currentView.apiGet("airportGroup", prms, (response) => {
		//		this.onCitiesResponse(response);
		//	});
		//}
			
		//private onCitiesResponse(cities) {
		//	this.citiesManager.createCities(cities, this.currentPlanningType);
		//}

		//private getPopulationFromZoom(zoom) {
		//	if (zoom < 3) {
		//		return 2000000;
		//	}
		//	if (zoom === 3) {
		//		return 800000;
		//	}
		//	if (zoom === 4) {
		//		return 600000;
		//	}
		//	if (zoom === 5) {
		//		return 400000;
		//	}
		//	if (zoom === 6) {
		//		return 200000;
		//	}

		//	if (zoom === 7) {
		//		return 50000;
		//	}

		//	return 1;
		//}

	}
}