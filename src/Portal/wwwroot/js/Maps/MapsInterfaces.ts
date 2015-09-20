
module Maps {

	export class CountryHighligt {
			countryCode: string;
			countryConfig: PolygonConfig;
				}

	export class PlaceMarker {
			 
	 constructor(lat: number, lng: number) {
		this.lat = lat;
		 this.lng = lng;
	 }

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


	export interface IMapsDriver {

		mapObj: any;

		drawPolygon(polygonCoordinates: any, polygonConfig: PolygonConfig);
		drawPin(place: PlaceMarker);		
		setMapObj(mapObj: any);
		destroyAll();

		setView(lat: number, lng: number, zoom: number);
		moveToAnimated(lat: number, lng: number, zoom: number);
		getPosition();
		getZoom();
	}

	export interface IMapsOperations {
	  drawCountry(country: CountryHighligt);
		drawCountries(countries: CountryHighligt[]);
		drawPlace(place: PlaceMarker);
		drawPlaces(places: PlaceMarker[]);
		setBaseMapsOperations(mapsDriver: IMapsDriver);
		setView(lat: number, lng: number, zoom: number);
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


