
module Maps {

	export class CountryHighligt {
			countryCode: string;
			countryConfig: PolygonConfig;
				}

	export class PlaceMarker {		
		lat: number;
		lng: number;
		city: string;
		dates: string[];
		geoNamesId: string;
	}


	export class PolygonConfig {

		constructor() {
			var defaultColor = '#2F81DE';

			this.borderColor = defaultColor;
			this.borderOpacity = 1;
			this.borderWeight = 1;

			this.fillColor = defaultColor;
			this.fillOpacity = 0.6;
		}

		borderColor: string;
		borderOpacity: number;
		borderWeight: number;

		fillColor: string;
		fillOpacity: number;

	  countryCode: string;
	}

	export class Places {
	 public places: any;
	 public cities: any;
	 public countries: any;
	 public states: any;
	}

	export class PlacesDisplay {
	 public places: PlaceMarker[];
	 public countries: CountryHighligt[];
	 public states: CountryHighligt[];
	 public cities: PlaceMarker[];
	}


	export interface IMapsDriver {

		mapObj: any;

		drawPolygon(polygonCoordinates: any, polygonConfig: PolygonConfig);
		drawPin(place: PlaceMarker);
		drawPoint(point: PlaceMarker);		
		setMapObj(mapObj: any);
		destroyAll();

		setView(lat: number, lng: number, zoom: number);
		moveToAnimated(lat: number, lng: number, zoom: number);
		getPosition();
		getZoom();
		drawPopUp(marker, city);
		removePin(gid);	  
	}
	
		export enum ViewType { D3, D2, D1 }
		export enum DataType { Visited, Interested }
		export enum DisplayEntity { Pin, Countries, Heat }

		export interface IMapsCreator {

			mapObj: any;

			show(mapsLoadedCallback);
			setRootElement(rootElement: string);			
			hide();

			onCenterChanged: Function;
		}				

	export class PeopleSelection {
	 public me: boolean;
	 public friends: boolean;
	 public everybody: boolean;
	 public singleFriends: string[];
	}


}



