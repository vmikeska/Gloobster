module Maps {
	export class MapsOperations {

		public mapsDriver: Maps.IMapsDriver;
		public countryShapes: Common.CountryShapes;


		constructor() {
		 this.countryShapes = new Common.CountryShapes();
		}

		public setBaseMapsOperations(baseMapsOperations: Maps.IMapsDriver) {
			this.mapsDriver = baseMapsOperations;
		}

		public drawCountry(country: Maps.CountryHighligt) {

			var countryParts = this.countryShapes.getCoordinatesByCountry(country.countryCode);

			if (!countryParts) {
				console.log("missing country with code: " + country.countryCode);
				return;
			}
			countryParts.forEach(countryPart => {
				this.mapsDriver.drawPolygon(countryPart, country.countryConfig);
			});
		}

		public drawCountries(countries: Maps.CountryHighligt[]) {
			countries.forEach(country => {
				this.drawCountry(country);
			});
		}

		public drawCity(city: Maps.PlaceMarker) {
			this.mapsDriver.drawPin(city);
		}

		public drawCities(cities: Maps.PlaceMarker[]) {
			cities.forEach(city => {
				this.drawCity(city);
			});
		}

		public drawPlace(place: Maps.PlaceMarker) {
			this.mapsDriver.drawPoint(place);
		}

		public drawPlaces(places: Maps.PlaceMarker[]) {
			places.forEach(place => {
				this.drawPlace(place);
			});
		}

		public setView(lat: number, lng: number, zoom: number) {
			this.mapsDriver.setView(lat, lng, zoom);
		}
	}


}