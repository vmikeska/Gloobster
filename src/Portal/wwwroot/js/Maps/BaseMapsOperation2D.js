var BaseMapsOperation2D = (function () {
    function BaseMapsOperation2D() {
        this.polygons = [];
        this.markers = [];
    }
    BaseMapsOperation2D.prototype.drawPolygon = function (polygonCoordinates, polygonConfig) {
        var polygon = L.polygon(polygonCoordinates, {
            color: polygonConfig.borderColor,
            opacity: polygonConfig.borderOpacity,
            weight: polygonConfig.borderWeight,
            fillColor: polygonConfig.fillColor,
            fillOpacity: polygonConfig.fillOpacity
        }).addTo(this.mapObj);
        this.markers.push(polygon);
    };
    BaseMapsOperation2D.prototype.drawPin = function (place) {
        var marker = L.marker([place.lat, place.lng]).addTo(this.mapObj);
        this.markers.push(marker);
    };
    BaseMapsOperation2D.prototype.drawPoint = function (point) {
        var latLng = L.latLng(point.lat, point.lng);
        this.heat.addLatLng(latLng);
    };
    BaseMapsOperation2D.prototype.setMapObj = function (mapObj) {
        this.mapObj = mapObj;
        this.createHeatLayer();
    };
    BaseMapsOperation2D.prototype.destroyAll = function () {
        var _this = this;
        this.markers.forEach(function (marker) {
            _this.mapObj.removeLayer(marker);
        });
        this.markers = [];
        this.polygons.forEach(function (polygon) {
            _this.mapObj.removeLayer(polygon);
        });
        this.polygons = [];
        this.mapObj.removeLayer(this.heat);
        this.createHeatLayer();
    };
    BaseMapsOperation2D.prototype.createHeatLayer = function () {
        this.heat = L.heatLayer([], { maxZoom: 12 }).addTo(this.mapObj);
    };
    BaseMapsOperation2D.prototype.setView = function (lat, lng, zoom) {
        this.mapObj.setView([lat, lng], zoom);
    };
    BaseMapsOperation2D.prototype.moveToAnimated = function (lat, lng, zoom) {
        this.mapObj.setView([lat, lng], zoom, { animation: true });
        //this.mapObj.panTo([lat, lng]);
    };
    BaseMapsOperation2D.prototype.getPosition = function () {
        return this.mapObj.getCenter();
    };
    BaseMapsOperation2D.prototype.getZoom = function () {
        return this.mapObj.getZoom();
    };
    return BaseMapsOperation2D;
})();
//# sourceMappingURL=BaseMapsOperation2D.js.map