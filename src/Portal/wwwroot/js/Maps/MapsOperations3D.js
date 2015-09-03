var MapsOperations3D = (function () {
    function MapsOperations3D(baseOperations) {
        this.baseOperations = baseOperations;
    }
    MapsOperations3D.prototype.drawCountry = function (countryParts, countryConfig) {
        var _this = this;
        if (!countryParts) {
            return;
        }
        countryParts.forEach(function (countryPart) {
            _this.baseOperations.drawPolygon(countryPart, countryConfig);
        });
    };
    MapsOperations3D.prototype.drawCountries = function (countries, color) {
        var self = this;
        countries.forEach(function (country) {
            self.drawCountry(country, color);
        });
    };
    MapsOperations3D.prototype.drawPlace = function (lat, lng) {
        this.baseOperations.drawPin(lat, lng);
    };
    MapsOperations3D.prototype.drawPlaces = function (places) {
        var self = this;
        places.forEach(function (place) {
            self.drawPlace(place.lat, place.lng);
        });
    };
    return MapsOperations3D;
})();
//# sourceMappingURL=MapsOperations3D.js.map