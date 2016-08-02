module Maps {

	export class BaseMapsOperation2D implements IMapsDriver {

	 private cityPopupTemplate: any;

	 constructor() {
		var source = $("#cityPopup-template").html();
		this.cityPopupTemplate = Handlebars.compile(source);
	 }

		public mapObj: any;

		private polygons = [];
		private markers = [];

		public heat: any;


		public drawPolygon(polygonCoordinates: any, polygonConfig: PolygonConfig) {
			var polygon = L.polygon(polygonCoordinates, {
				color: polygonConfig.borderColor,
				opacity: polygonConfig.borderOpacity,
				weight: polygonConfig.borderWeight,

				fillColor: polygonConfig.fillColor,
				fillOpacity: polygonConfig.fillOpacity
			}).addTo(this.mapObj);
			this.markers.push(polygon);
		}

		private visitedPin = null;

		private getVisitedPin() {
			if (this.visitedPin == null) {
				this.visitedPin = L.icon({
					iconUrl: '../images/visited-ico.png',
					//shadowUrl: 'leaf-shadow.png',

					iconSize: [26, 31], // size of the icon
					//shadowSize: [50, 64], // size of the shadow
					iconAnchor: [13, 31], // point of the icon which will correspond to marker's location
					//shadowAnchor: [4, 62],  // the same for the shadow
					popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
				});
			}
				
			return this.visitedPin;
		}

		public drawPin(place: PlaceMarker) {
				var marker = L.marker([place.lat, place.lng], { icon: this.getVisitedPin()}).addTo(this.mapObj);
			marker.gid = place.geoNamesId;
			this.markers.push(marker);
			return marker;
		}

		public removePin(gid) {
			var m = _.find(this.markers, (marker) => {
				return marker.gid === gid;
			});
			this.mapObj.removeLayer(m);
			$(m).remove();
			this.markers = _.reject(this.markers, (marker) => {
				return marker.gid === gid;
			});
		}

		public drawPopUp(marker, context) {

		  if (context.dates) {
			  context.dates = _.map(context.dates, (d) => {
						return moment.utc(d).format("lll");
			  });
		  }
		  
			var popupContent = this.cityPopupTemplate(context);

			marker.bindPopup(popupContent, {
				closeButton: true,
				minWidth: 200
			});
		}

		public drawPoint(point: PlaceMarker) {
			var latLng = L.latLng(point.lat, point.lng);
			this.heat.addLatLng(latLng);
		}


		public setMapObj(mapObj) {
			this.mapObj = mapObj;
			this.createHeatLayer();
		}

		public destroyAll() {

			this.markers.forEach(marker => {
				this.mapObj.removeLayer(marker);
			});
			this.markers = [];

			this.polygons.forEach(polygon => {
				this.mapObj.removeLayer(polygon);
			});
			this.polygons = [];

			this.mapObj.removeLayer(this.heat);
			this.createHeatLayer();
		}

		private createHeatLayer() {
			this.heat = L.heatLayer([], { maxZoom: 12 }).addTo(this.mapObj);
		}

		public setView(lat: number, lng: number, zoom: number) {
			this.mapObj.setView([lat, lng], zoom);
		}

		public moveToAnimated(lat: number, lng: number, zoom: number) {
			this.mapObj.setView([lat, lng], zoom, { animation: true });
			//this.mapObj.panTo([lat, lng]);
		}

		public getPosition() {
			return this.mapObj.getCenter();
		}

		getZoom() {
			return this.mapObj.getZoom();
		}

	}
}