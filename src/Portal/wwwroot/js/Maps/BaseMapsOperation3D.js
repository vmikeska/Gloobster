var BaseMapsOperation3D = (function () {
    function BaseMapsOperation3D() {
        this.markers = [];
        this.polygons = [];
    }
    BaseMapsOperation3D.prototype.drawPolygon = function (polygonCoordinates, polygonConfig) {
        var polygon = WE.polygon(polygonCoordinates, {
            color: polygonConfig.borderColor,
            opacity: polygonConfig.borderOpacity,
            weight: polygonConfig.borderWeight,
            fillColor: polygonConfig.fillColor,
            fillOpacity: polygonConfig.fillOpacity
        }).addTo(this.mapObj);
        this.polygons.push(polygon);
    };
    BaseMapsOperation3D.prototype.drawPin = function (place) {
        var marker = WE.marker([place.lat, place.lng]).addTo(this.mapObj);
        this.markers.push(marker);
    };
    BaseMapsOperation3D.prototype.setMapObj = function (mapObj) {
        this.mapObj = mapObj;
    };
    BaseMapsOperation3D.prototype.destroyAll = function () {
        this.markers.forEach(function (marker) {
            $(marker.element).remove();
        });
        this.polygons.forEach(function (polygon) {
            polygon.destroy();
        });
        this.markers = [];
        this.polygons = [];
    };
    BaseMapsOperation3D.prototype.setView = function (lat, lng, zoom) {
        this.mapObj.setView([lat, lng], zoom);
    };
    BaseMapsOperation3D.prototype.moveToAnimated = function (lat, lng, zoom) {
        var bounds = [lat, lng];
        this.mapObj.panTo(bounds);
    };
    BaseMapsOperation3D.prototype.getPosition = function () {
        var center = this.mapObj.getCenter();
        return { "lat": center[0], "lng": center[1] };
    };
    BaseMapsOperation3D.prototype.getZoom = function () {
        return this.mapObj.getZoom();
    };
    BaseMapsOperation3D.prototype.drawPoint = function (point) { };
    return BaseMapsOperation3D;
})();
//polygon.onClick(function(e) {
//	 alert('poly!');
//	});
//setTimeout(function() {
//		//polygon.setFillColor(polygonConfig.fillColor, polygonConfig.fillOpacity);
//		polygon.destroy();
//}, 5000); 
//# sourceMappingURL=BaseMapsOperation3D.js.map