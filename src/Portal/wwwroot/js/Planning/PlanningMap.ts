module Planning {
	export class PlanningMap {

		public onSelectionChanged: Function;		
		public onMapLoaded: Function;
			
		public map: Map;

		private viewData: any;
		public planningType: PlanningType;
		public viewType = FlightCacheRecordType.Country;
			
		//dont delete
		//private customForm: CustomForm;

		private resultsEngine: ResultsManager;

		public init() {
			this.initMap();

			this.initCountriesFnc();

			this.initCitiesFnc();
		}

		public changeViewType(type: FlightCacheRecordType) {
			this.viewType = type;

			var data = this.getViewTypeData();
			this.map.switch(this.viewType, data);
		}

		private initMap() {
			this.map = new Map(this);

			this.map.onMapLoaded = () => {				
				this.onMapLoaded();
			}

			this.map.init("map");
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

				PlanningSender.updateProp(data, (response) => {});
			};
		}

		private initCitiesFnc() {

				this.map.onCityChange = (gid, isSelected) => {
						this.onSelectionChanged(gid, isSelected, FlightCacheRecordType.City);

						var data = PlanningSender.createRequest(this.planningType, "cities", {
								gid: gid,
								selected: isSelected
						});

						//dont delete
						//if (planningType === PlanningType.Custom) {
						//		data.values.customId = NamesList.selectedSearch.id;
						//}

						PlanningSender.updateProp(data, (response) => {});
				};


				


			//this.citiesManager = new CitiesManager(this.map.mapObj);

			//this.citiesManager.onSelectionChanged = (id, newState, type) => {
			//	this.onSelectionChanged(id, newState, type);
			//}
		}

		public loadCategory(pt: PlanningType) {
			this.planningType = pt;
			this.initData();								
		}

		private initData() {

			this.getTabData(this.planningType, (data) => {

					this.viewData = data;

					var vData = this.getViewTypeData();
					this.map.switch(this.viewType, vData);
					

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

		private getViewTypeData() {
			if (this.viewType === FlightCacheRecordType.Country) {				
				return this.viewData.countryCodes;
			} else {

				return this.viewData.cities;				
			}
		}

		
			

		}

}