var Maps;
(function (Maps) {
    var MapsOperations = (function () {
        function MapsOperations() {
            this.countryShapes = new Common.CountryShapes();
            this.usShapes = new Common.UsStates();
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
        MapsOperations.prototype.drawUsState = function (state) {
            var _this = this;
            var stateParts = this.usShapes.getCoordinatesByStateCode(state.countryCode);
            if (!stateParts) {
                console.log("missing state with code: " + state.countryCode);
                return;
            }
            stateParts.forEach(function (statePart) {
                _this.mapsDriver.drawPolygon(statePart, state.countryConfig);
            });
        };
        MapsOperations.prototype.drawUsStates = function (states) {
            var _this = this;
            states.forEach(function (state) {
                _this.drawUsState(state);
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
            var pvm = Views.ViewBase.currentView;
            var contBase = { isJustMe: pvm.peopleFilter.justMeSelected() };
            cities.forEach(function (city) {
                var context = $.extend(contBase, city);
                _this.drawCity(context);
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