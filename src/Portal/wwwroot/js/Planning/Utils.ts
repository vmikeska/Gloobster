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

class GraphicConfig {
	public borderColor = "#000000";
	public fillColorUnselected = "#CFCAC8";
	public fillColorSelected = "#57CF5F";
	public fillColorHover = "#57CF9D";

 constructor() {
	this.cityIcon = this.getCityIcon();
	 this.focusIcon = this.getCityIconFocus();
	 this.selectedIcon = this.getSelectedIcon();
	 this.initConfigs();
 }

	public selectedConfig: PolygonConfig;
	public unselectedConfig: PolygonConfig;

	public cityIcon: any;
	public focusIcon: any;
	public selectedIcon: any;

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

 public convert() {
	 return {
		 color: this.borderColor,
		 opacity: this.borderOpacity,
		 weight: this.borderWeight,

		 fillColor: this.fillColor,
		 fillOpacity: this.fillOpacity
		}
 }
}

class PlanningSender {

	public static updateProp(data, callback) {
		Views.ViewBase.currentView.apiPut("PlanningProperty", data, (response) => {
			callback(response);
		});
	}

	public static pushProp(data, callback) {
	 Views.ViewBase.currentView.apiPost("PlanningProperty", data, (response) => {
	 callback(response);
	 });
	}

	public static createRequest(planningType: PlanningType, propertyName: string, values) {
		var request = { planningType: planningType, propertyName: propertyName, values: values };
		return request;
	}
}

enum PlanningType { Anytime, Weekend, Custom }
