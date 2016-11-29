module Planning {
	export class DelayedCallbackMap {

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

	export class GraphicConfig {
		
		constructor() {
			this.cityIcon = this.getCityIcon();
			this.focusIcon = this.getCityIconFocus();
			this.selectedIcon = this.getSelectedIcon();			
		}
			

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
		
}