



interface IMapsBaseOperation {
		drawPolygon: Function;
		drawPin: Function;
}

interface IMapsOperations {
		drawCountry: Function;
		drawCountries: Function;		
		drawPlace: Function;
		drawPlaces: Function;
}

class PolygonConfig {

		constructor() {
				var defaultColor = '#2F81DE';

				this.borderColor = defaultColor;
				this.borderOpacity = 1;
				this.borderWeight = 1;

				this.fillColor = defaultColor;
				this.fillOpacity = 0.5;
		}

		borderColor: string;
		borderOpacity: number;
		borderWeight: number;

		fillColor: string;
		fillOpacity: number;		
}



class MapsBaseOperation3d implements IMapsBaseOperation {

		public earth: any;

		constructor(earth: any) {
				this.earth = earth;
		} 

		public drawPolygon(polygonCoordinates, polygonConfig: PolygonConfig) {
				var polygon = WE.polygon(polygonCoordinates, {
						color: polygonConfig.borderColor,
						opacity: polygonConfig.borderOpacity,
						weight: polygonConfig.borderWeight,

						fillColor: polygonConfig.fillColor,
						fillOpacity: polygonConfig.fillOpacity
						
				}).addTo(this.earth);

				//polygon.on('click', function() { alert('test'); });
		}

		public drawPin(lat: number, lng: number) {
				WE.marker([lat, lng]).addTo(this.earth);
		}

}




class MapsOperations3d implements IMapsOperations {

		public baseOperations: MapsBaseOperation3d;

		constructor(baseOperations: MapsBaseOperation3d) {
				this.baseOperations = baseOperations;
		}

		drawCountry(countryParts, countryConfig: PolygonConfig) {
				
				if (!countryParts) {
						return;
				}
				
				countryParts.forEach((countryPart) => {
						this.baseOperations.drawPolygon(countryPart, countryConfig);
				});														
		}

		drawCountries(countries, color) {
			var self = this;
			countries.forEach(function (country) {
						self.drawCountry(country, color);
				});
		}

		drawPlace(lat: number, lng: number) {
				this.baseOperations.drawPin(lat, lng);	
		}

		drawPlaces(places) {

				var self = this;
				places.forEach(function (place) {
						self.drawPlace(place.lat, place.lng);
				});				
		}
}