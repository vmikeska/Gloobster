class MapsOperations implements Maps.IMapsOperations {

	public baseMapsOperations: Maps.IMapsBaseOperation;
	public countryShapes: CountryShapes;


	constructor(countryShapes: CountryShapes) {
		this.countryShapes = countryShapes;
	}

	public setBaseMapsOperations(baseMapsOperations: Maps.IMapsBaseOperation) {
		this.baseMapsOperations = baseMapsOperations;
	}

	public drawCountry(country: Maps.CountryHighligt) {

		var countryParts = this.countryShapes.getCoordinatesByCountry(country.countryCode);

		if (!countryParts) {
			console.log("missing country with code: " + country.countryCode);
			return;
		}

		var self = this;
		countryParts.forEach(function(countryPart) {
			self.baseMapsOperations.drawPolygon(countryPart, country.countryConfig);
		});
	}

	public drawCountries(countries: Maps.CountryHighligt[]) {
		countries.forEach(country => {
			this.drawCountry(country);
		});
	}

	public drawPlace(place: Maps.PlaceMarker) {
		this.baseMapsOperations.drawPin(place);
	}

	public drawPlaces(places: Maps.PlaceMarker[]) {

		var self = this;
		places.forEach(function(place) {
			self.drawPlace(place);
		});
	}
}



