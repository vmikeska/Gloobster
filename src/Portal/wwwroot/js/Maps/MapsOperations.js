//implements Maps.IMapsOperations
var MapsOperations = (function () {
    function MapsOperations() {
        this.countryShapes = new CountryShapes();
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
    MapsOperations.prototype.drawCity = function (place) {
        this.mapsDriver.drawPin(place);
    };
    MapsOperations.prototype.drawCities = function (places) {
        var _this = this;
        places.forEach(function (place) {
            _this.drawCity(place);
        });
    };
    MapsOperations.prototype.setView = function (lat, lng, zoom) {
        this.mapsDriver.setView(lat, lng, zoom);
    };
    return MapsOperations;
})();
//# sourceMappingURL=MapsOperations.js.map