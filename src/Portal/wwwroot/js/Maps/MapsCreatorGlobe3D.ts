
module Maps {
	export class MapsCreatorGlobe3D implements Maps.IMapsCreator {

		public rootElement: string;
		
		public mapObj: any;

		setRootElement(rootElement: string) {
			this.rootElement = rootElement;
		}

		public show(mapsLoadedCallback) {
			this.showPreloader(true);
			this.loadScript("/lib/webglearth-api.js", () => {
				this.showPreloader(false);
				var mapOptions = {};
				var layerOptions = {};

				
				//var mapUrl = 'http://d.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';

				//todo: hide this somehow ?
				var mapUrl = 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ';
					
				this.mapObj = new WE.map(this.rootElement, mapOptions);
				WE.tileLayer(mapUrl, layerOptions).addTo(this.mapObj);

				mapsLoadedCallback();
			});
		}

		private showPreloader(visible) {
			if (visible) {
				$("#map").append(`<div class="preloader-cont"><img src="/images/Preloader_1.gif" /></div>`);
			} else {
				$(".preloader-cont").remove();
			}
		}

		private loadScript(scriptUrl: string, callback: Function) {
				$.getScript(scriptUrl, (data, textStatus, jqxhr) => {					
						callback();
				});
		}

			//not using anymore
			//var mapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

			//discontinued, keep as examples when changin the map
			//if (this.mapType === 'MQCDN') {
			//	mapUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg';
			//	mapOptions = { atmosphere: true, center: [0, 0], zoom: 0 };
			//	layerOptions = {
			//		subdomains: '1234',
			//		attribution: 'Tiles Courtesy of MapQuest & webglearth.org'
			//	};
			//}

			//if (this.mapType === 'MQCDN1') {
			//	mapUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
			//	layerOptions = {
			//	 attribution: 'Tiles Courtesy of MapQuest & webglearth.org'
			//	}
			//}

		hide() {
			$("#" + this.rootElement).empty();
		}

		onCenterChanged: Function;
	}
}