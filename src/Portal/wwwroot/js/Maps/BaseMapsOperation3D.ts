module Maps {
	export class BaseMapsOperation3D implements IMapsDriver {

		public mapObj: any;

		private markers = [];
		private polygons = [];

		private cityPopupTemplate: any;

		constructor() {
		 var source = $("#cityPopup-template").html();
		 this.cityPopupTemplate = Handlebars.compile(source);
		}

		public drawPolygon(polygonCoordinates: any, polygonConfig: PolygonConfig) {
			var polygon = WE.polygon(polygonCoordinates, {
				color: polygonConfig.borderColor,
				opacity: polygonConfig.borderOpacity,
				weight: polygonConfig.borderWeight,

				fillColor: polygonConfig.fillColor,
				fillOpacity: polygonConfig.fillOpacity
			}).addTo(this.mapObj);

			this.polygons.push(polygon);		 
		}

		public drawPopUp(marker, context) {
		 var popupContent = this.cityPopupTemplate(context);

		 marker.bindPopup(popupContent, {
			closeButton: true,
			minWidth: 200
		 });
		}

		public removePin(gid) {			
				var m = _.find(this.markers, (marker) => {
					return marker.gid === gid;
				});
				m.removeFrom(this.mapObj);
				this.markers = _.reject(this.markers, (marker) => {
					return marker.gid === gid;
				});			
		}

		public drawPin(place: PlaceMarker) {
			var marker = WE.marker([place.lat, place.lng]).addTo(this.mapObj);
			marker.gid = place.geoNamesId;
			this.markers.push(marker);
			return marker;
		}

		public setMapObj(mapObj) {
			this.mapObj = mapObj;
		}

		public destroyAll() {
			this.markers.forEach(marker => {				
				marker.detach();
			});
			this.polygons.forEach(polygon => {
				polygon.destroy();
			});

			this.markers = [];
			this.polygons = [];
		}

		public setView(lat: number, lng: number, zoom: number) {
			this.mapObj.setView([lat, lng], zoom);
		}

		public moveToAnimated(lat: number, lng: number, zoom: number) {
			var bounds = [lat, lng];
			this.mapObj.panTo(bounds);
		}

		public getPosition() {
			var center = this.mapObj.getCenter();
			return { "lat": center[0], "lng": center[1] };
		}

		getZoom() {
			return this.mapObj.getZoom();
		}

		drawPoint(point: PlaceMarker) {}
	}
}