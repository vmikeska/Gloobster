var Maps;
(function (Maps) {
    var MapsOperations = (function () {
        function MapsOperations() {
            this.countryShapes = new Common.CountryShapes();
        }
        MapsOperations.prototype.setBaseMapsOperations = function (baseMapsOperations) {
            this.mapsDriver = baseMapsOperations;
        };
        MapsOperations.prototype.drawCountry = function (country) {
            var _this = this;
            var countryParts = this.countryShapes.getCoordinatesByCountryCode(country.countryCode);
            if (!countryParts) {
                console.log("missing country with code: " + country.countryCode);
                return;
            }
            countryParts.forEach(function (countryPart) {
                _this.mapsDriver.drawPolygon(countryPart, country.countryConfig);
            });
        };
        MapsOperations.prototype.drawCountries = function (countries) {
            var _this = this;
            countries.forEach(function (country) {
                _this.drawCountry(country);
            });
        };
        MapsOperations.prototype.drawCity = function (city) {
            var marker = this.mapsDriver.drawPin(city);
            this.mapsDriver.drawPopUp(marker, city);
        };
        MapsOperations.prototype.removeCity = function (gid) {
            this.mapsDriver.removePin(gid);
        };
        MapsOperations.prototype.drawCities = function (cities) {
            var _this = this;
            cities.forEach(function (city) {
                _this.drawCity(city);
            });
        };
        MapsOperations.prototype.drawPlace = function (place) {
            this.mapsDriver.drawPoint(place);
        };
        MapsOperations.prototype.drawPlaces = function (places) {
            var _this = this;
            places.forEach(function (place) {
                _this.drawPlace(place);
            });
        };
        MapsOperations.prototype.setView = function (lat, lng, zoom) {
            this.mapsDriver.setView(lat, lng, zoom);
        };
        return MapsOperations;
    })();
    Maps.MapsOperations = MapsOperations;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsOperations.js.map