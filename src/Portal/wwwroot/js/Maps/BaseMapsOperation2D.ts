

class BaseMapsOperation2D implements Maps.IMapsDriver {

 public mapObj: any;

 public drawPolygon(polygonCoordinates: any, polygonConfig: Maps.PolygonConfig) {
	var polygon = L.polygon(polygonCoordinates, {
	 color: polygonConfig.borderColor,
	 opacity: polygonConfig.borderOpacity,
	 weight: polygonConfig.borderWeight,

	 fillColor: polygonConfig.fillColor,
	 fillOpacity: polygonConfig.fillOpacity
	}).addTo(this.mapObj);
 }

 public drawPin(place: Maps.PlaceMarker) {
	var marker = L.marker([place.lat, place.lng]).addTo(this.mapObj);
 }

 public setMapObj(mapObj) {
	this.mapObj = mapObj;
 }

	public destroyAll() {}
}
