
module Maps {
	export class MapsCreatorGlobe3D implements Maps.IMapsCreator {

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
			var mapOptions = {};
			var layerOptions = {};
			var mapUrl = '';

			if (this.mapType === 'OSM') {
				mapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			}

			if (this.mapType === 'MQCDN') {
				mapUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg';
				mapOptions = { atmosphere: true, center: [0, 0], zoom: 0 };
				layerOptions = {
					subdomains: '1234',
					attribution: 'Tiles Courtesy of MapQuest'
				};
			}

			if (this.mapType === 'MQCDN1') {
				mapUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
				layerOptions = {
					attribution: 'Tiles Courtesy of MapQuest'
				}
			}

			this.mapObj = new WE.map(this.rootElement, mapOptions);
			WE.tileLayer(mapUrl, layerOptions).addTo(this.mapObj);

			mapsLoadedCallback();
		}

		hide() {
			$("#" + this.rootElement).empty();
		}
	}
}