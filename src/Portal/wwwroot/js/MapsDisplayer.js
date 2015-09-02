var PolygonConfig = (function () {
    function PolygonConfig() {
        var defaultColor = '#2F81DE';
        this.borderColor = defaultColor;
        this.borderOpacity = 1;
        this.borderWeight = 1;
        this.fillColor = defaultColor;
        this.fillOpacity = 0.5;
    }
    return PolygonConfig;
})();
var MapsBaseOperation3d = (function () {
    function MapsBaseOperation3d(earth) {
        this.earth = earth;
    }
    MapsBaseOperation3d.prototype.drawPolygon = function (polygonCoordinates, polygonConfig) {
        var polygon = WE.polygon(polygonCoordinates, {
            color: polygonConfig.borderColor,
            opacity: polygonConfig.borderOpacity,
            weight: polygonConfig.borderWeight,
            fillColor: polygonConfig.fillColor,
            fillOpacity: polygonConfig.fillOpacity
        }).addTo(this.earth);
        //polygon.on('click', function() { alert('test'); });
    };
    MapsBaseOperation3d.prototype.drawPin = function (lat, lng) {
        WE.marker([lat, lng]).addTo(this.earth);
    };
    return MapsBaseOperation3d;
})();
var MapsOperations3d = (function () {
    function MapsOperations3d(baseOperations) {
        this.baseOperations = baseOperations;
    }
    MapsOperations3d.prototype.drawCountry = function (countryParts, countryConfig) {
        var _this = this;
        if (!countryParts) {
            return;
        }
        countryParts.forEach(function (countryPart) {
            _this.baseOperations.drawPolygon(countryPart, countryConfig);
        });
    };
    MapsOperations3d.prototype.drawCountries = function (countries, color) {
        var self = this;
        countries.forEach(function (country) {
            self.drawCountry(country, color);
        });
    };
    MapsOperations3d.prototype.drawPlace = function (lat, lng) {
        this.baseOperations.drawPin(lat, lng);
    };
    MapsOperations3d.prototype.drawPlaces = function (places) {
        var self = this;
        places.forEach(function (place) {
            self.drawPlace(place.lat, place.lng);
        });
    };
    return MapsOperations3d;
})();
//# sourceMappingURL=MapsDisplayer.js.map