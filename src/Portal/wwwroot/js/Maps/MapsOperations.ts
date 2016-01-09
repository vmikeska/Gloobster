module Maps {
	export class MapsOperations {

		public mapsDriver: IMapsDriver;
		public countryShapes: Common.CountryShapes;


		constructor() {
		 this.countryShapes = new Common.CountryShapes();
		}

		public setBaseMapsOperations(baseMapsOperations: IMapsDriver) {
			this.mapsDriver = baseMapsOperations;
		}

		public drawCountry(country: CountryHighligt) {

			var countryParts = this.countryShapes.getCoordinatesByCountryCode(country.countryCode);

			if (!countryParts) {
				console.log("missing country with code: " + country.countryCode);
				return;
			}
			countryParts.forEach(countryPart => {
				this.mapsDriver.drawPolygon(countryPart, country.countryConfig);
			});
		}

		public drawCountries(countries: CountryHighligt[]) {
			countries.forEach(country => {
				this.drawCountry(country);
			});
		}

		public drawCity(city: PlaceMarker) {
			var marker = this.mapsDriver.drawPin(city);
			this.mapsDriver.drawPopUp(marker, city);
		}

	  public removeCity(gid) {
		  this.mapsDriver.removePin(gid);
		}
	 
		public drawCities(cities: PlaceMarker[]) {
			cities.forEach(city => {
				this.drawCity(city);
			});
		}

		public drawPlace(place: PlaceMarker) {
			this.mapsDriver.drawPoint(place);
		}

		public drawPlaces(places: PlaceMarker[]) {
			places.forEach(place => {
				this.drawPlace(place);
			});
		}

		public setView(lat: number, lng: number, zoom: number) {
			this.mapsDriver.setView(lat, lng, zoom);
		}
	}


}