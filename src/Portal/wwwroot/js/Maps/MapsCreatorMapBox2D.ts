﻿
module Maps {
	export class MapsCreatorMapBox2D implements IMapsCreator {

		public rootElement: string;
		
		public mapObj: any;

		public options = {
			tileLayer: {
				// This map option disables world wrapping. by default, it is false.
				continuousWorld: false,
				// This option disables loading tiles outside of the world bounds.
				noWrap: true
			},
			maxBounds: null,
			maxZoom: 19,
			minZoom: 2,
			zoom: 3,
			zoomControl: false,
			center: new L.LatLng(34.5133, -94.1629)
		};
		

		public setRootElement(rootElement: string) {
			this.rootElement = rootElement;
		}
			
		public show(mapsLoadedCallback) {
			var self = this;

			//this.loadScript("https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.js", () => {
					//self.loadScript("https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js", () => {
					//self.loadScript("https://api.mapbox.com/mapbox.js/plugins/leaflet-heat/v0.1.3/leaflet-heat.js", () => {
						self.loadMap();
						mapsLoadedCallback(this.mapObj);
					//});
				//});
			//});
		}

		private loadMap() {
			L.mapbox.accessToken = "pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";

			this.options.maxBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));			
			
			this.mapObj = L.mapbox.map(this.rootElement, 'gloobster.afeef633', this.options);
			
			this.mapObj.on("move", (e) => {
				if (this.onCenterChanged) {
					var c = this.mapObj.getCenter();
					this.onCenterChanged(c);
			 }				
			});
		}

		private loadScript(scriptUrl: string, callback: Function) {
			$.getScript(scriptUrl, (data, textStatus, jqxhr) => {
				//console.log("Loaded: " + scriptUrl);
				callback();
			});
		}

		public hide() {
			this.mapObj.remove();
		}

		public onCenterChanged: Function;
	}
}