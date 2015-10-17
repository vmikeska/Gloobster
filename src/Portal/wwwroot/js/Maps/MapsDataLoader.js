var MapsDataLoader = (function () {
    function MapsDataLoader(owner) {
        this.owner = owner;
    }
    MapsDataLoader.prototype.getPluginData = function (pluginType, displayEntity) {
        var _this = this;
        var request = [["pluginType", pluginType.toString()], ["displayEntity", displayEntity.toString()]];
        this.owner.apiGet("PinBoardStats", request, function (response) {
            _this.places = new Maps.Places();
            _this.viewPlaces = new Maps.PlacesDisplay();
            _this.places.places = response.VisitedPlaces;
            _this.places.cities = response.VisitedCities;
            _this.places.countries = response.VisitedCountries;
            _this.executePlugin(pluginType);
            _this.dataLoadedCallback();
        });
    };
    MapsDataLoader.prototype.executePlugin = function (pluginType) {
        if (pluginType === Maps.PluginType.MyPlacesVisited) {
            var singleColorConfig = new Maps.PolygonConfig();
            singleColorConfig.fillColor = "#009900";
            var countries = _.map(this.places.countries, function (country) {
                var countryOut = new Maps.CountryHighligt();
                countryOut.countryCode = country.CountryCode3;
                countryOut.countryConfig = singleColorConfig;
                return countryOut;
            });
            this.viewPlaces.countries = countries;
            var cities = _.map(this.places.cities, function (city) {
                var marker = new Maps.PlaceMarker(city.Location.Lat, city.Location.Lng);
                return marker;
            });
            this.viewPlaces.cities = cities;
        }
    };
    return MapsDataLoader;
})();
//# sourceMappingURL=MapsDataLoader.js.map