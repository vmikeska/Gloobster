module Planning {
	export class PlanningMap {
			public get v(): Views.ViewBase {
					return Views.ViewBase.currentView;
			}

		public map: Map;
		public config: ISectionConfig;

		public onSelectionChanged: Function;		
		public onMapLoaded: Function;
			
		public viewType = FlightCacheRecordType.Country;
	
		constructor(config: ISectionConfig) {
				this.config = config;
		}

		private inited = false;

		public init() {

			if (this.inited) {
				this.map.currentMap.show();
				return;
			}

			this.inited = true;

			this.initMap();

			this.initCountriesFnc();

			this.initCitiesFnc();
		}

		private initMap() {
			this.map = new Map(this);
			this.map.init();

			this.initMapSwitch();
		}

		private initCountriesFnc() {
				this.map.onCountryChange = (cc, isSelected) => {

					if (this.onSelectionChanged) {
						this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);
						}

					var customId = this.config.customId;
					
				var data = { type: this.config.type, cc: cc, selected: isSelected, customId: customId};
					
				this.v.apiPut("SelCountry", data, () => {});					
				};
		}

		private initCitiesFnc() {
			this.map.onCityChange = (gid, isSelected) => {

				if (this.onSelectionChanged) {
					this.onSelectionChanged(gid, isSelected, FlightCacheRecordType.City);
				}

				var customId = this.config.customId;

				var data = { type: this.config.type, gid: gid, selected: isSelected, customId: customId };

				this.v.apiPut("SelCity", data, () => {});
			};
		}

		private initMapSwitch() {
				var $cont = $(".map-type-switch");
				var $btns = $cont.find(".btn");
				$btns.click((e) => {
						var $t = $(e.target);
						var type = $t.hasClass("country") ? FlightCacheRecordType.Country : FlightCacheRecordType.City;

						if (type === this.viewType) {
								return;
						} 

						this.viewType = type;

						$btns.removeClass("active");
						$t.addClass("active");
								
						this.map.switch(this.viewType);
				});
		}
	
		}

}