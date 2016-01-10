var Maps;
(function (Maps) {
    var BaseMapsOperation3D = (function () {
        function BaseMapsOperation3D() {
            this.markers = [];
            this.polygons = [];
            var source = $("#cityPopup-template").html();
            this.cityPopupTemplate = Handlebars.compile(source);
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
        BaseMapsOperation3D.prototype.drawPopUp = function (marker, city) {
            var popupContent = this.cityPopupTemplate(city);
            marker.bindPopup(popupContent, {
                closeButton: true,
                minWidth: 200
            });
        };
        BaseMapsOperation3D.prototype.removePin = function (gid) {
            var m = _.find(this.markers, function (marker) {
                return marker.gid === gid;
            });
            m.removeFrom(this.mapObj);
            this.markers = _.reject(this.markers, function (marker) {
                return marker.gid === gid;
            });
        };
        BaseMapsOperation3D.prototype.drawPin = function (place) {
            var marker = WE.marker([place.lat, place.lng]).addTo(this.mapObj);
            marker.gid = place.geoNamesId;
            this.markers.push(marker);
            return marker;
        };
        BaseMapsOperation3D.prototype.setMapObj = function (mapObj) {
            this.mapObj = mapObj;
        };
        BaseMapsOperation3D.prototype.destroyAll = function () {
            this.markers.forEach(function (marker) {
                marker.detach();
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
    Maps.BaseMapsOperation3D = BaseMapsOperation3D;
})(Maps || (Maps = {}));
//# sourceMappingURL=BaseMapsOperation3D.js.map