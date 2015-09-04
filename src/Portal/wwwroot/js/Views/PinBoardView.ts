



	class PinBoardView extends Views.ViewBase {

		public visitedCountries: any;
		public visitedPlaces: any;
	 
		public mapsManager: MapsManager;

		public mapsBaseOperations: BaseMapsOperation3D;
		public mapsOperations: MapsOperations3D;
	 
		public initialize() {
			this.mapsManager = new MapsManager();
			this.mapsManager.switchToView(Maps.ViewType.D3);		 
			this.getVisitedCountries();
			this.getVisitedPlaces();
		}


		get countryConfig(): Maps.PolygonConfig {
			var countryConfig = new Maps.PolygonConfig();
			countryConfig.fillColor = "#009900";

			return countryConfig;
		}
	 
		public clearDisplayedCountries() {

		}

		private getUserId() {
			return '55e0b1d7ff89d0435456e6f5';
		}

		private onVisitedCountriesResponse(visitedCountries) {
			this.visitedCountries = visitedCountries;

			var countryConf = this.countryConfig;

			var mappedCountries = _.map(this.visitedCountries, countryCode => {
				var country = new Maps.CountryHighligt();
				country.countryCode = countryCode;
				country.countryConfig = countryConf;
				return country;
			});

			this.mapsManager.setVisitedCountries(mappedCountries);
		}

		private onVisitedPlacesResponse(response) {
			this.visitedPlaces = response.Places;

			var mappedPlaces = _.map(this.visitedPlaces, place => {
				var marker = new Maps.PlaceMarker();
				marker.lat = place.PlaceLatitude;
				marker.lng = place.PlaceLongitude;
				return marker;
			});

			this.mapsManager.setVisitedPlaces(mappedPlaces);
		}

		public getVisitedPlaces() {
			var self = this;
			super.apiGet("visitedPlace", [["userId", this.getUserId()]], function(response) {
				self.onVisitedPlacesResponse(response);
			});
		}

		public getVisitedCountries() {
			var self = this;
			super.apiGet("visitedCountry", [["userId", this.getUserId()]], function(response) {
				self.onVisitedCountriesResponse(response.Countries3);
			});
		}

	}



