var BaseMapsOperation2D = (function () {
    function BaseMapsOperation2D() {
    }
    BaseMapsOperation2D.prototype.drawPolygon = function (polygonCoordinates, polygonConfig) {
        //var polygon = WE.polygon(polygonCoordinates, {
        // color: polygonConfig.borderColor,
        // opacity: polygonConfig.borderOpacity,
        // weight: polygonConfig.borderWeight,
        // fillColor: polygonConfig.fillColor,
        // fillOpacity: polygonConfig.fillOpacity
        //}).addTo(this.mapObj);
    };
    BaseMapsOperation2D.prototype.drawPin = function (place) {
        var marker = L.marker([place.lat, place.lng]).addTo(this.mapObj);
    };
    BaseMapsOperation2D.prototype.setMapObj = function (mapObj) {
        this.mapObj = mapObj;
    };
    return BaseMapsOperation2D;
})();
//# sourceMappingURL=BaseMapsOperation2D.js.map