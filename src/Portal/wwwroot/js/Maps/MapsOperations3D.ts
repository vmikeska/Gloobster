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

			if (!countryParts) {
							console.log("missing country with code: " + country.countryCode);
				return;
			}

			var self = this;
				countryParts.forEach(function(countryPart) {
						self.baseOperations.drawPolygon(countryPart, country.countryConfig);
				});														
		}

		drawCountries(countries: Maps.CountryHighligt[]) {
			countries.forEach(country => {
				this.drawCountry(country);
			});
	}

		drawPlace(place: Maps.PlaceMarker) {
		this.baseOperations.drawPin(place);	
	}

	drawPlaces(places: Maps.PlaceMarker[]) {

		var self = this;
		places.forEach(function (place) {
			self.drawPlace(place);
		});				
	}
}



