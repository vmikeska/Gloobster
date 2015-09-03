class MapsOperations3D implements Maps.IMapsOperations {

		public baseOperations: Maps.IMapsBaseOperation;
		public countryShapes: CountryShapes;

		constructor(baseOperations: Maps.IMapsBaseOperation, countryShapes: CountryShapes) {
				this.baseOperations = baseOperations;
				this.countryShapes = countryShapes;
		}
		
		//(countryParts, countryConfig: Maps.PolygonConfig)
		drawCountry(country: Maps.CountryHighligt) {
				var countryParts = this.countryShapes.getCoordinatesByCountry(country.countryCode);
				
				countryParts.forEach((countryPart) => {
						this.baseOperations.drawPolygon(countryPart, country.countryConfig);
				});														
		}

		drawCountries(countries: Maps.CountryHighligt[]) {
			countries.forEach(country => {
				this.drawCountry(country);
			});
	}

	drawPlace(lat: number, lng: number) {
		//this.baseOperations.drawPin(lat, lng);	
	}

	drawPlaces(places) {

		//var self = this;
		//places.forEach(function (place) {
		//	self.drawPlace(place.lat, place.lng);
		//});				
	}
}
