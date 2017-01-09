var Planning;
(function (Planning) {
    var MapConstants = (function () {
        function MapConstants() {
        }
        MapConstants.mapOptions = {
            zoom: 3,
            maxZoom: 19,
            minZoom: 3,
            maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
            zoomControl: false,
            center: [34.5133, -94.1629]
        };
        MapConstants.tileOptions = {
            noWrap: true
        };
        MapConstants.unselCountryStyle = {
            color: "#9096a0",
            weight: 1,
            opacity: 1,
            fillColor: "#005476",
            fillOpacity: 1
        };
        MapConstants.selCountryStyle = {
            color: "#9096a0",
            weight: 1,
            opacity: 1,
            fillColor: "#3DA243",
            fillOpacity: 1
        };
        MapConstants.hoverStyle = {
            fillColor: "#F56E12",
            fillOpacity: 1
        };
        return MapConstants;
    }());
    Planning.MapConstants = MapConstants;
    var Map = (function () {
        function Map(planningMap) {
            this.planningMap = planningMap;
        }
        Map.prototype.anySelected = function () {
            var city = _.find(this.mapCities.cities, function (c) { return c.selected; });
            return (city) || any(this.mapCountries.selectedCountries);
        };
        Map.prototype.init = function () {
            var _this = this;
            this.mapCities = new Planning.MapCities(this);
            this.mapCountries = new Planning.MapCountries(this);
            this.mapCountries.init(function () {
                _this.onMapLoaded();
            });
        };
        Map.prototype.switch = function (type) {
            if (type === FlightCacheRecordType.Country) {
                this.mapCountries.show();
                this.mapCities.hide();
                if (this.mapCities.position) {
                    var po1 = this.mapCities.position.getPos();
                    this.mapCountries.position.setPos(po1);
                }
            }
            if (type === FlightCacheRecordType.City) {
                var po2 = this.mapCountries.position.getPos();
                this.mapCountries.hide();
                this.mapCities.show();
                this.mapCities.position.setPos(po2);
            }
        };
        Map.prototype.countrySelChanged = function (cc, isSelected) {
            if (this.onCountryChange) {
                this.onCountryChange(cc, isSelected);
            }
        };
        return Map;
    }());
    Planning.Map = Map;
})(Planning || (Planning = {}));
//# sourceMappingURL=Map.js.map