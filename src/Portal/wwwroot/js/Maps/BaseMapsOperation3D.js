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
    };
    BaseMapsOperation3D.prototype.drawPin = function (place) {
        var marker = WE.marker([place.lat, place.lng]).addTo(this.mapObj);
    };
    BaseMapsOperation3D.prototype.setMapObj = function (mapObj) {
        this.mapObj = mapObj;
    };
    BaseMapsOperation3D.prototype.destroyAll = function () {
        this.markers.forEach(function (marker) { marker.destroy(); });
        this.polygons.forEach(function (marker) { marker.destroy(); });
    };
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