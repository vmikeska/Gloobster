
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
				}

				public drawPin(place: Maps.PlaceMarker) {
								var marker = WE.marker([place.lat, place.lng]).addTo(this.mapObj);
				}
				
				public setMapObj(mapObj) {
								this.mapObj = mapObj;
				}

				public destroyAll() {
				 this.markers.forEach(function (marker) { marker.destroy(); });
				 this.polygons.forEach(function (marker) { marker.destroy(); });
				}

				public setView(lat: number, lng: number, zoom: number) {
				 this.mapObj.setView([lat, lng], zoom);
				}
 
}




			//polygon.onClick(function(e) {
			//	 alert('poly!');
			//	});

				
			//setTimeout(function() {
			//		//polygon.setFillColor(polygonConfig.fillColor, polygonConfig.fillOpacity);
			//		polygon.destroy();
			//}, 5000);