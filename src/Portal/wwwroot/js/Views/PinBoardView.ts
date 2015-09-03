



	class PinBoardView extends Views.ViewBase {

		public visitedCountries: any;
		public visitedPlaces: any;

		//public mapsCreator: MapsCreator;
		public mapsManager: MapsManager;

		public mapsBaseOperations: MapsBaseOperation3D;
		public mapsOperations: MapsOperations3D;
		//public countryShapes: CountryShapes;

		public initialize() {

			//this.mapsCreator = new MapsCreator('earth_div');
				//this.mapsCreator.initializeGlobe(MapTypes.MQCDN1);
				this.mapsManager = new MapsManager();
				this.mapsManager.switchToView(Maps.ViewType.D3);

			

			//this.mapsBaseOperations = new MapsBaseOperation3D(this.mapsCreator.earth);
			//this.mapsOperations = new MapsOperations3D(this.mapsBaseOperations);

			//this.countryShapes = new CountryShapes();

			this.getVisitedCountries();
			this.getVisitedPlaces();
		}


		get countryConfig(): Maps.PolygonConfig {
				var countryConfig = new Maps.PolygonConfig();
			countryConfig.fillColor = "#009900";

			return countryConfig;
		}


		//public setView(lat, lng) {
		//		this.mapsCreator.earth.setView([lat, lng], 3);
		//}

		public displayVisitedCountries() {
			//this.clearDisplayedCountries();

			//var countryConf = this.countryConfig;
			//this.visitedCountries.forEach(countryCode => {
			//	var countryCoordinates = this.countryShapes.getCoordinatesByCountry(countryCode);
			//	this.mapsOperations.drawCountry(countryCoordinates, countryConf);
			//});
		}

		public displayVisitedPlaces() {
			//this.visitedPlaces.forEach(place => {
			//	this.mapsOperations.drawPlace(place.PlaceLatitude, place.PlaceLongitude);
			//});
		}

		public clearDisplayedCountries() {

		}

		private getUserId() {
			return '55e0b1d7ff89d0435456e6f5';
		}

		private onVisitedCountriesResponse(visitedCountries) {
				this.mapsManager.countries =

				this.visitedCountries = visitedCountries;
			this.displayVisitedCountries();
		}

		public getVisitedPlaces() {
			var self = this;
			super.apiGet("visitedPlace", [["userId", this.getUserId()]], function(response) {
				self.visitedPlaces = response.Places;
				self.displayVisitedPlaces();
			});
		}

		public getVisitedCountries() {
			var self = this;
			super.apiGet("visitedCountry", [["userId", this.getUserId()]], function(response) {
				self.onVisitedCountriesResponse(response.Countries3);
			});
		}

	}


