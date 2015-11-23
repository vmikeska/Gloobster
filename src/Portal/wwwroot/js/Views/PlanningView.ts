
class PlanningView extends Views.ViewBase {

 private maps: MapsCreatorMapBox2D;
 private mapsDriver: PlanningMapsOperations;
  
 constructor() {
	 super();
	
	 this.initialize();
 }

	public initialize() {
		this.maps = new MapsCreatorMapBox2D();
		this.maps.setRootElement("map");
		this.maps.show((map) => {
		 var mapOper = new PlanningMap(PlanningType.Anytime, map);			
		});

	}
}

class DelayedCallbackMap {

	public callback: Function;

	public delay = 600;

	private timeoutId = null;
	
	public receiveEvent() {

		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
		this.timeoutId = setTimeout(() => {
			this.timeoutId = null;			
			this.callback();

		}, this.delay);
	}
}

class PlanningMap {
	
 private borderColor = "#000000";
 private fillColorUnselected = "#CFCAC8";
 private fillColorSelected = "#57CF5F";
 private fillColorHover = "#57CF9D";

 private selectedConfig: PolygonConfig;
 private unselectedConfig: PolygonConfig;

 private delayedZoomCallback: DelayedCallbackMap;

 private viewData: any;

 private citiesLayerGroup: any;
 
	constructor(planningType: PlanningType, map) {
		this.citiesLayerGroup = L.layerGroup();
		this.map = map;
		this.map.addLayer(this.citiesLayerGroup);

		this.countryShapes = new CountryShapes2();
		this.initConfigs();
		this.initCountries(planningType);
		this.initCities();

		this.cityIcon = this.getCityIcon();
		this.focusIcon = this.getCityIconFocus();
		this.selectedIcon = this.getSelectedIcon();
	}

	public countryShapes: CountryShapes2;
 public map: any;
 
 private selectedCountries: any;

 private cityIcon: any;
 private focusIcon: any;
 private selectedIcon: any;

 private initCities() {
	 this.delayedZoomCallback = new DelayedCallbackMap();
	 this.delayedZoomCallback.callback = () => {
		 console.log("zoom finished master");
		 var bounds = this.map.getBounds();

		 var zoom = this.map.getZoom();
		 var population = this.getPopulationFromZoom(zoom);
		 console.log("pop: " + population);


		 var prms = [
			 ["latSouth", bounds._southWest.lat],
			 ["lngWest", bounds._southWest.lng],
			 ["latNorth", bounds._northEast.lat],
			 ["lngEast", bounds._northEast.lng],
			 ["minPopulation", population],
			 ["planningType", PlanningType.Anytime.toString()]
		 ];

		 Views.ViewBase.currentView.apiGet("airportGroup", prms, (response) => {
			this.onCitiesResponse(response);						
		 });

	 };

	 this.map.on("zoomend", e => {
		 this.delayedZoomCallback.receiveEvent();
	 });
	 this.map.on("moveend", e => {
		 this.delayedZoomCallback.receiveEvent();
	 });
	 
 }

	private onCitiesResponse(cities) {
		this.createCities(cities);

		console.log("received cities: " + cities.length);
	}

	private createCities(cities) {
	 var filteredCities = _.filter(cities, (city) => {
		 return !_.contains(this.selectedCountries, city.countryCode);
	 });

	 this.cityPairMarker = [];

	 this.citiesLayerGroup.clearLayers();
	
	 filteredCities.forEach((city) => {
		var cityMarker = this.createCity(city);
		this.cityPairMarker.push({ city: city, marker: cityMarker });
	 });
 }

 private cityPairMarker: any;

 private getCitesMarkersByCountry(countryCode: string) {
	 var pairs = _.filter(this.cityPairMarker, (pair) => { return pair.city.countryCode === countryCode });
	 return pairs;
 }

	private createCity(city) {

		var icon = city.selected ? this.selectedIcon : this.cityIcon;

		var marker = L.marker([city.coord.Lat, city.coord.Lng], { icon: icon });
		marker.selected = city.selected;
		marker.gid = city.gid;

		marker.on("mouseover", (e) => {
			e.target.setIcon(this.focusIcon);
		});
		marker.on("mouseout", (e) => {
			if (!e.target.selected) {
				e.target.setIcon(this.cityIcon);
			} else {
			 e.target.setIcon(this.selectedIcon);
			}
		});

		marker.on("click", (e) => {
		 this.callChangeCitySelection(PlanningType.Anytime, e.target.gid, !e.target.selected, (res) => {
			 e.target.setIcon(this.selectedIcon);
			 e.target.selected = !e.target.selected;
			});		 
		});
	 
		marker.addTo(this.citiesLayerGroup);

		return marker;
	}

	private callChangeCitySelection(planningType: PlanningType, gid: string, selected: boolean, callback: Function) {
	 var data = this.createRequest(PlanningType.Anytime, "cities", {
		gid: gid,
		selected: selected
	 });

	 Views.ViewBase.currentView.apiPut("PlanningProperty", data, (response) => {
		callback(response);
	 });
	}

	private getCityIcon() {
	 var icon = L.icon({
	 iconUrl: '../../images/MapIcons/CityNormal.png',
	 //shadowUrl: 'leaf-shadow.png',

	 iconSize: [16, 16], // size of the icon
	 //shadowSize: [50, 64], // size of the shadow
	 iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
	 //shadowAnchor: [4, 62],  // the same for the shadow
	 //popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
	});
	 return icon;
	}

	private getSelectedIcon() {
	 var icon = L.icon({
		iconUrl: '../../images/MapIcons/CitySelected.png',		
		iconSize: [16, 16],
		iconAnchor: [8, 8]		
	 });
	 return icon;
	}

 private getCityIconFocus() {
	 var icon = L.icon({
		 iconUrl: '../../images/MapIcons/CityFocus.png',
		 iconSize: [20, 20],
		 iconAnchor: [10, 10]
	 });
	 return icon;
 }

 private getPopulationFromZoom(zoom) {
	 if (zoom < 3) {		 
		 return 2000000;
	 }
	 if (zoom === 3) {
		return 800000;
	 }
	 if (zoom === 4) {
		return 600000;
	 }
	 if (zoom === 5) {
		return 400000;
	 }
	 if (zoom === 6) {
		return 200000;
	 }

	 if (zoom === 7) {
		return 50000;
	 }

	 return 1;
 }

 private initCountries(planningType: PlanningType) {
	 this.getTabData(planningType, (data) => {
		 this.viewData = data;
		 this.createCountries(this.viewData.countryCodes);
	 });
 }

 private initConfigs() {
	var sc = new PolygonConfig();
	sc.fillColor = this.fillColorSelected;
	sc.borderColor = this.borderColor;
	 this.selectedConfig = sc;

	 var uc = new PolygonConfig();
	 uc.fillColor = this.fillColorUnselected;
	 uc.borderColor = this.borderColor;
	 this.unselectedConfig = uc;
 }

 public createCountries(selectedCountries) {

	 this.selectedCountries = selectedCountries;

	 this.countryShapes.countriesList.forEach((country) => {
		 var selected = _.contains(selectedCountries, country.name);
		 var config = selected ? this.selectedConfig : this.unselectedConfig;

		 this.drawCountry(country, config);
	 });
	
 }
 
 public drawCountry(country: any, polygonConfig: PolygonConfig) {
	
	var polygon = L.polygon(country.coordinates, {
	 color: polygonConfig.borderColor,
	 opacity: polygonConfig.borderOpacity,
	 weight: polygonConfig.borderWeight,

	 fillColor: polygonConfig.fillColor,
	 fillOpacity: polygonConfig.fillOpacity
	}).addTo(this.map);
	 polygon.countryCode = country.name;

	polygon.on("click", (e) => {
	 var countryCode = e.target.countryCode;
	 var wasSelected = _.contains(this.selectedCountries, countryCode);
	 var newFillColor = wasSelected ? this.fillColorUnselected : this.fillColorSelected;

		this.callChangeCountrySelection(PlanningType.Anytime, countryCode, !wasSelected, (response) => {
			e.target.setStyle({ fillColor: newFillColor });
			if (wasSelected) {
			 this.selectedCountries = _.reject(this.selectedCountries, (cntry) => { return cntry === countryCode; });
				this.showCityMarkersByCountry(countryCode);
			} else {
				this.selectedCountries.push(countryCode);
				this.hideCityMarkersByCountry(countryCode);
			}

		});
	 });
	
	polygon.on("mouseover", (e) => {	 
	 e.target.setStyle({ fillColor: this.fillColorHover });
	});

	polygon.on("mouseout", (e) => {
		var countryCode = e.target.countryCode;
		var selected = _.contains(this.selectedCountries, countryCode);
	  var fillColor = selected ? this.fillColorSelected : this.fillColorUnselected;
	
		e.target.setStyle({ fillColor: fillColor });
	});
	
 }

	private hideCityMarkersByCountry(countryCode: string) {
		var cityMarkerPairs = this.getCitesMarkersByCountry(countryCode);
		cityMarkerPairs.forEach((pair) => {
		 this.citiesLayerGroup.removeLayer(pair.marker);
			pair.marker = null;
		});
	}

	private showCityMarkersByCountry(countryCode: string) {
		var cityMarkerPairs = this.getCitesMarkersByCountry(countryCode);
		cityMarkerPairs.forEach((pair) => {
		 var cityMarker = this.createCity(pair.city);
			pair.marker = cityMarker;			
		});
	}

	private getTabData(planningType: PlanningType, callback) {
	 var prms = [["planningType", planningType.toString()]];
	 Views.ViewBase.currentView.apiGet("PlanningProperty", prms, (response) => {
		 callback(response);
	 });
 } 

 private callChangeCountrySelection(planningType: PlanningType, countryCode: string, selected: boolean, callback: Function) {
	 var data = this.createRequest(PlanningType.Anytime, "countries", {
		 countryCode: countryCode,
		 selected: selected
	 });
	
	 Views.ViewBase.currentView.apiPut("PlanningProperty", data, (response) => {
		 callback(response);
	 });
 }

 private createRequest(planningType: PlanningType, propertyName: string, values) {
	 var request = { planningType: planningType, propertyName: propertyName, values: values };
	 return request;
 }

}

enum PlanningType { Anytime, Weekend, Custom}

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


class PlanningBaseMapsOperations  {

 

 private polygons = [];
 private markers = [];

 


 //public heat: any;


 //public drawPolygon(polygonCoordinates: any, polygonConfig: Maps.PolygonConfig) {
	//var polygon = L.polygon(polygonCoordinates, {
	// color: polygonConfig.borderColor,
	// opacity: polygonConfig.borderOpacity,
	// weight: polygonConfig.borderWeight,

	// fillColor: polygonConfig.fillColor,
	// fillOpacity: polygonConfig.fillOpacity
	//}).addTo(this.mapObj);
	//this.markers.push(polygon);
 //}

	//public drawPin(place: Maps.PlaceMarker) {
	//	var marker = L.marker([place.lat, place.lng]).addTo(this.mapObj);
	//	this.markers.push(marker);
	//}

	//public drawPoint(point: Maps.PlaceMarker) {
	// var latLng = L.latLng(point.lat, point.lng);
	// this.heat.addLatLng(latLng);
	//}


	//public setMapObj(mapObj) {
	// this.mapObj = mapObj;
	// this.createHeatLayer();
 //}

	//public destroyAll() {

	//	this.markers.forEach(marker => {
	//		this.mapObj.removeLayer(marker);
	//	});
	//	this.markers = [];

	//	this.polygons.forEach(polygon => {
	//		this.mapObj.removeLayer(polygon);
	//	});
	//	this.polygons = [];

	//	this.mapObj.removeLayer(this.heat);
	//	this.createHeatLayer();
	//}

	//private createHeatLayer() {
	// this.heat = L.heatLayer([], { maxZoom: 12 }).addTo(this.mapObj);
	//}

	//public setView(lat: number, lng: number, zoom: number) {
	// this.mapObj.setView([lat, lng], zoom);
	//}

	//public moveToAnimated(lat: number, lng: number, zoom: number) {
	// this.mapObj.setView([lat, lng], zoom, { animation: true });	 
	//}

	//public getPosition() {
	//	return this.mapObj.getCenter();
	//}

	//getZoom() {
	//	return this.mapObj.getZoom();
	//}

}

class PlanningMapsOperations {

	//public mapsDriver: Maps.IMapsDriver;
	

	//public setBaseMapsOperations(baseMapsOperations: Maps.IMapsDriver) {
	// this.mapsDriver = baseMapsOperations;
	//}

	//public drawCountry(country: Maps.CountryHighligt) {

	//	var countryParts = this.countryShapes.getCoordinatesByCountry(country.countryCode);

	//	if (!countryParts) {
	//		console.log("missing country with code: " + country.countryCode);
	//		return;
	//	}
	//	countryParts.forEach(countryPart => {
	//		this.mapsDriver.drawPolygon(countryPart, country.countryConfig);
	//	});
	//}

	//public drawCountries(countries: Maps.CountryHighligt[]) {
	//	countries.forEach(country => {
	//		this.drawCountry(country);
	//	});
	//}

	//public drawCity(city: Maps.PlaceMarker) {
	// this.mapsDriver.drawPin(city);
	//}

	//public drawCities(cities: Maps.PlaceMarker[]) {
	// cities.forEach(city => {
	//		this.drawCity(city);
	//	});
	//}

	//public drawPlace(place: Maps.PlaceMarker) {
	// this.mapsDriver.drawPoint(place);
	//}

	//public drawPlaces(places: Maps.PlaceMarker[]) {
	// places.forEach(place => {
	// this.drawPlace(place);
	// });
	//}

	//public setView(lat: number, lng: number, zoom: number) {
	//	this.mapsDriver.setView(lat, lng, zoom);
	//}
}



