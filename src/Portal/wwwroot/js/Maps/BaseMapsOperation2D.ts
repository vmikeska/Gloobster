module Maps {

	export class BaseMapsOperation2D implements Maps.IMapsDriver {

		public mapObj: any;

		private polygons = [];
		private markers = [];

		public heat: any;


		public drawPolygon(polygonCoordinates: any, polygonConfig: Maps.PolygonConfig) {
			var polygon = L.polygon(polygonCoordinates, {
				color: polygonConfig.borderColor,
				opacity: polygonConfig.borderOpacity,
				weight: polygonConfig.borderWeight,

				fillColor: polygonConfig.fillColor,
				fillOpacity: polygonConfig.fillOpacity
			}).addTo(this.mapObj);
			this.markers.push(polygon);
		}

		public drawPin(place: Maps.PlaceMarker) {
			var marker = L.marker([place.lat, place.lng]).addTo(this.mapObj);
			this.markers.push(marker);
		}

		public drawPoint(point: Maps.PlaceMarker) {
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