module Planning {
	export class PlanningMap {

		public onSelectionChanged: Function;		
		public onMapLoaded: Function;
			
		public map: Map;
			
		public viewType = FlightCacheRecordType.Country;

		public planningType: PlanningType;
		public customId;
		
		private resultsEngine: ResultsManager;

		public dealsSearch: Planning.DealsSearch;
		constructor(dealsSearch: Planning.DealsSearch) {
				this.dealsSearch = dealsSearch;
		}

		public init() {
			this.initMap();

			this.initCountriesFnc();

			this.initCitiesFnc();
		}

		public changeViewType(type: FlightCacheRecordType) {
			this.viewType = type;
				
			this.map.switch(this.viewType);
		}

		private initMap() {
			this.map = new Map(this);

			this.map.onMapLoaded = () => {				
				this.onMapLoaded();
			}

			this.map.init();
		}

		private initCountriesFnc() {
			this.map.onCountryChange = (cc, isSelected) => {
				this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);

				var customId = this.dealsSearch.currentSetter.getCustomId();
					
				var data = { type: this.planningType, cc: cc, selected: isSelected, customId: customId};
					
				this.dealsSearch.v.apiPut("SelCountry", data, () => {});					
			};
		}

		private initCitiesFnc() {

				this.map.onCityChange = (gid, isSelected) => {
						this.onSelectionChanged(gid, isSelected, FlightCacheRecordType.City);

						var customId = this.dealsSearch.currentSetter.getCustomId();

						var data = { type: this.planningType, gid: gid, selected: isSelected, customId: customId };

						this.dealsSearch.v.apiPut("SelCity", data, () => { });		
				};				
		}

		public loadCategory(pt: PlanningType) {
			this.planningType = pt;
			this.initData();								
		}

		private initData() {

				this.getSelectedCCs(this.planningType, (ccs) => {
					
					this.map.mapCountries.set(ccs);

					this.map.switch(this.viewType);					
				});				
		}

		private getSelectedCCs(planningType: PlanningType, callback) {
				var customId = this.dealsSearch.currentSetter.getCustomId();

				var prms = [["type", planningType.toString()], ["customId", customId]];
				
				Views.ViewBase.currentView.apiGet("SelCountry", prms, (response) => {
						callback(response);
				});
		}
			
			

		}

}