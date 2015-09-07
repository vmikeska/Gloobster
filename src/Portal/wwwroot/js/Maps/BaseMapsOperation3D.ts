
class BaseMapsOperation3D implements Maps.IMapsDriver {

	public mapObj: any;

	private markers = [];
	private polygons = [];


	public drawPolygon(polygonCoordinates: any, polygonConfig: Maps.PolygonConfig) {
		var polygon = WE.polygon(polygonCoordinates, {
			color: polygonConfig.borderColor,
			opacity: polygonConfig.borderOpacity,
			weight: polygonConfig.borderWeight,

			fillColor: polygonConfig.fillColor,
			fillOpacity: polygonConfig.fillOpacity
		}).addTo(this.mapObj);

		this.polygons.push(polygon);
	}

	public drawPin(place: Maps.PlaceMarker) {
		var marker = WE.marker([place.lat, place.lng]).addTo(this.mapObj);
		this.markers.push(marker);
	}

	public setMapObj(mapObj) {
		this.mapObj = mapObj;
	}

	public destroyAll() {
		this.markers.forEach(function(marker) {
			 $(marker.element).remove();
		});
		this.polygons.forEach(function(polygon) {
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
}


//polygon.onClick(function(e) {
			//	 alert('poly!');
			//	});

				
			//setTimeout(function() {
			//		//polygon.setFillColor(polygonConfig.fillColor, polygonConfig.fillOpacity);
			//		polygon.destroy();
			//}, 5000);