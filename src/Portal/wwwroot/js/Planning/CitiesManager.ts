module Planning {
	export class CitiesManager {

		
		//public hideCityMarkersByCountry(countryCode: string) {
		//	var cityMarkerPairs = this.getCitiesMarkersByCountry(countryCode);
		//	cityMarkerPairs.forEach((pair) => {
		//		this.citiesLayerGroup.removeLayer(pair.marker);
		//		pair = null;
		//	});
		//	this.citiesToMarkers = _.reject(this.citiesToMarkers, (i) => { return i === null });
		//}

		//public showCityMarkersByCountry(countryCode: string) {
		//	var cities = this.getCitiesByCountry(countryCode);

		//	cities.forEach((city) => {
		//		var cityMarker = this.createCity(city);
		//		this.addCityToMarker(city, cityMarker);
		//	});
		//}

		//private addCityToMarker(city, marker) {
		//	this.citiesToMarkers.push({ city: city, marker: marker });
		//}

		//private getCitiesMarkersByCountry(countryCode: string) {
		//	var pairs = _.filter(this.citiesToMarkers, (pair) => { return pair.city.countryCode === countryCode });
		//	return pairs;
		//}

		//private getCitiesByCountry(countryCode: string) {
		//	var cities = _.filter(this.cities, (city) => { return city.countryCode === countryCode });
		//	return cities;
		//}
			

	}
}