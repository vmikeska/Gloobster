module Planning {

	export class MapConstants {
				public static mapOptions = {
						zoom: 3,
						maxZoom: 19,
						minZoom: 3,
						maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
						zoomControl: false,
						//todo: change to user location
						center: [34.5133, -94.1629]
				};

				public static tileOptions = {
						noWrap: true
				};

				public static unselCountryStyle = {
						color: "#9096a0",
						weight: 1,
						opacity: 1,

						fillColor: "#005476",
						fillOpacity: 1
				};

				public static selCountryStyle = {
						color: "#9096a0",
						weight: 1,
						opacity: 1,
						
						fillColor: "#3DA243",
						fillOpacity: 1		
				};

				public static hoverStyle = {
						fillColor: "#F56E12",
						fillOpacity: 1
				};
		}

	export class Map {
			
		public onCountryChange: Function;
		public onCityChange: Function;
		public onMapLoaded: Function;

		public mapCountries: MapCountries;
		public mapCities: MapCities;

		public planningMap: PlanningMap;
			
		constructor(planningMap: PlanningMap) {
			this.planningMap = planningMap;
		}

		public anySelected() {
			var city = _.find(this.mapCities.cities, (c) => { return c.selected; });
			return (city) || any(this.mapCountries.selectedCountries);
		}

		public init() {
				
				this.mapCities = new MapCities(this);

				this.mapCountries = new MapCountries(this);

				this.mapCountries.init(() => {
						this.onMapLoaded();									
				});				
		}

		public switch(type: FlightCacheRecordType) {
				
				
				if (type === FlightCacheRecordType.Country) {												
						this.mapCountries.show();
						this.mapCities.hide();

						if (this.mapCities.position) {
								var po1 = this.mapCities.position.getPos();
								this.mapCountries.position.setPos(po1);
						}
				}

				if (type === FlightCacheRecordType.City) {
						var po2 = this.mapCountries.position.getPos();
						
						this.mapCountries.hide();
						this.mapCities.show();

						this.mapCities.position.setPos(po2);
				}
		}
			

		
		public countrySelChanged(cc, isSelected: boolean) {
			if (this.onCountryChange) {
				this.onCountryChange(cc, isSelected);
			}
		}
	
	}

	
}