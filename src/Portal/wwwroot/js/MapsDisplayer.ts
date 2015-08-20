
declare var WE: any;


interface IMapsBaseOperation {
		drawPolygon: Function;
		drawPin: Function;
}

interface IMapsOperations {
		drawContry: Function;
		drawCountries: Function;
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
		}

		public drawPin() {
				
		}

}




class MapsOperations3d implements IMapsOperations {

		public baseOperations: MapsBaseOperation3d;

		constructor(baseOperations: MapsBaseOperation3d) {
				this.baseOperations = baseOperations;
		}

		drawContry(countryParts, countryConfig: PolygonConfig) {
				
				if (!countryParts) {
						return;
				}
				
				countryParts.forEach((countryPart) => {
						this.baseOperations.drawPolygon(countryPart, countryConfig);
				});														
		}

		drawCountries(countries, color) {
				countries.forEach(function (country) {
						this.drawCountry(country, color);
				});
				
		}

}