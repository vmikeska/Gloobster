//implements Maps.IMapsOperations
class MapsOperations  {

	public mapsDriver: Maps.IMapsDriver;
	public countryShapes: CountryShapes;


	constructor() {	 
	 this.countryShapes = new CountryShapes();
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

		var self = this;
		countryParts.forEach(function(countryPart) {
		 self.mapsDriver.drawPolygon(countryPart, country.countryConfig);
		});
	}

	public drawCountries(countries: Maps.CountryHighligt[]) {
		countries.forEach(country => {
			this.drawCountry(country);
		});
	}

	public drawCity(place: Maps.PlaceMarker) {
	 this.mapsDriver.drawPin(place);
	}

	public drawCities(places: Maps.PlaceMarker[]) {
		places.forEach(place => {
			this.drawCity(place);
		});
	}

	public setView(lat: number, lng: number, zoom: number) {
		this.mapsDriver.setView(lat, lng, zoom);
	}
}



