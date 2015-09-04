var MapsOperations = (function () {
    function MapsOperations(countryShapes) {
        this.countryShapes = countryShapes;
    }
    MapsOperations.prototype.setBaseMapsOperations = function (baseMapsOperations) {
        this.mapsDriver = baseMapsOperations;
    };
    MapsOperations.prototype.drawCountry = function (country) {
        var countryParts = this.countryShapes.getCoordinatesByCountry(country.countryCode);
        if (!countryParts) {
            console.log("missing country with code: " + country.countryCode);
            return;
        }
        var self = this;
        countryParts.forEach(function (countryPart) {
            self.mapsDriver.drawPolygon(countryPart, country.countryConfig);
        });
    };
    MapsOperations.prototype.drawCountries = function (countries) {
        var _this = this;
        countries.forEach(function (country) {
            _this.drawCountry(country);
        });
    };
    MapsOperations.prototype.drawPlace = function (place) {
        this.mapsDriver.drawPin(place);
    };
    MapsOperations.prototype.drawPlaces = function (places) {
        var self = this;
        places.forEach(function (place) {
            self.drawPlace(place);
        });
    };
    MapsOperations.prototype.setView = function (lat, lng, zoom) {
        this.mapsDriver.setView(lat, lng, zoom);
    };
    return MapsOperations;
})();
//# sourceMappingURL=MapsOperations.js.map