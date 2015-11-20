
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

class PlanningMap {
	
 private borderColor = "#000000";
 private fillColorUnselected = "#CFCAC8";
 private fillColorSelected = "#57CF5F";
 private fillColorHover = "#57CF9D";

 private selectedConfig: PolygonConfig;
 private unselectedConfig: PolygonConfig;

 private viewData: any;

 constructor(planningType: PlanningType, map) {
	 this.map = map;
	 this.countryShapes = new CountryShapes();
	 this.initConfigs();

	 this.getTabData(planningType, (data) => {
		this.viewData = data;
		this.createCountries(this.viewData.countryCodes);
	 });
 }

 public countryShapes: CountryShapes;
 public map: any;
 
 private selectedCountries;

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
		 } else {
			 this.selectedCountries.push(countryCode);
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



