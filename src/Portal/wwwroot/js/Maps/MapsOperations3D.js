var MapsOperations3D = (function () {
    function MapsOperations3D(baseOperations, countryShapes) {
        this.baseOperations = baseOperations;
        this.countryShapes = countryShapes;
    }
    //(countryParts, countryConfig: Maps.PolygonConfig)
    MapsOperations3D.prototype.drawCountry = function (country) {
        var countryParts = this.countryShapes.getCoordinatesByCountry(country.countryCode);
        if (!countryParts) {
            console.log("missing country with code: " + country.countryCode);
            return;
        }
        var self = this;
        countryParts.forEach(function (countryPart) {
            self.baseOperations.drawPolygon(countryPart, country.countryConfig);
        });
    };
    MapsOperations3D.prototype.drawCountries = function (countries) {
        var _this = this;
        countries.forEach(function (country) {
            _this.drawCountry(country);
        });
    };
    MapsOperations3D.prototype.drawPlace = function (place) {
        this.baseOperations.drawPin(place);
    };
    MapsOperations3D.prototype.drawPlaces = function (places) {
        var self = this;
        places.forEach(function (place) {
            self.drawPlace(place);
        });
    };
    return MapsOperations3D;
})();
//# sourceMappingURL=MapsOperations3D.js.map