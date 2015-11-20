﻿

class MapsCreatorMapBox2D implements Maps.IMapsCreator {

 public rootElement: string;
 public mapType: any;

 public mapObj: any;

 setRootElement(rootElement: string) {
	this.rootElement = rootElement;
 }

 setMapType(mapType) {
	this.mapType = mapType;
 }
 

 show(mapsLoadedCallback) {
		var self = this;

		this.loadScript("http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js", () => {
			self.loadScript("https://api.mapbox.com/mapbox.js/v2.2.2/mapbox.js", () => {
			 self.loadScript("https://api.mapbox.com/mapbox.js/plugins/leaflet-heat/v0.1.3/leaflet-heat.js", () => {
					self.loadMap();
					mapsLoadedCallback(this.mapObj);
				});
			});
		});
	}

	loadMap() {
	 L.mapbox.accessToken = 'pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ';
	 this.mapObj = L.mapbox.map(this.rootElement, 'gloobster.afeef633');		
	}

 loadScript(scriptUrl: string, callback: Function) {
	 $.getScript(scriptUrl, function(data, textStatus, jqxhr) {
		console.log("Loaded: " + scriptUrl);
		callback();
	 });
 }

	hide() {	 
		this.mapObj.remove();
	}
};