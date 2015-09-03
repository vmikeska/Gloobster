
module Maps {

	export class CountryHighligt {
			countryCode: string;
			countryConfig: PolygonConfig;
	}

	export class PolygonConfig {

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


	export interface IMapsBaseOperation {
		drawPolygon: Function;
		drawPin: Function;
	}

	export interface IMapsOperations {
		drawCountry: Function;
		drawCountries: Function;
		drawPlace: Function;
		drawPlaces: Function;
	}

		export enum ViewType { D3, D2, D1 }

		export interface IMapsCreator {

			mapObj: any;

			show();
			setRootElement(rootElement: string);
			setMapType(mapType);
			hide();
		}				
}