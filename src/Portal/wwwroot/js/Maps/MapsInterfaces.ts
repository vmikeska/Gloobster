
module Maps {

	export class CountryHighligt {
			countryCode: string;
			countryConfig: PolygonConfig;
				}

	export class PlaceMarker {
					lat: number;
					lng: number;
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
		drawPolygon(polygonCoordinates: any, polygonConfig: PolygonConfig);
		drawPin(place: PlaceMarker);		
		setMapObj(mapObj: any);		
	}

	export interface IMapsOperations {
	  drawCountry(country: CountryHighligt);
		drawCountries(countries: CountryHighligt[]);
		drawPlace(place: PlaceMarker);
		drawPlaces(places: PlaceMarker[]);
		setBaseMapsOperations(baseMapsOperations: IMapsBaseOperation);
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



