var Maps;
(function (Maps) {
    var MapsDataLoader = (function () {
        function MapsDataLoader() {
        }
        MapsDataLoader.prototype.getPluginData = function (pluginType, displayEntity) {
            var _this = this;
            var request = [["pluginType", pluginType.toString()], ["displayEntity", displayEntity.toString()]];
            Views.ViewBase.currentView.apiGet("PinBoardStats", request, function (response) {
                console.log("newCit: " + response.visitedCities.length);
                _this.places = new Maps.Places();
                _this.viewPlaces = new Maps.PlacesDisplay();
                _this.places.places = response.visitedPlaces;
                _this.places.cities = response.visitedCities;
                _this.places.countries = response.visitedCountries;
                _this.mapToViewData();
                _this.dataLoadedCallback();
            });
        };
        MapsDataLoader.prototype.getColorByNumber = function (num) {
            var firstColor = "#0026BF";
            if (!num) {
                return firstColor;
            }
            if (num <= 1) {
                return firstColor;
            }
            else if (num <= 2) {
                return "#1300C2";
            }
            else if (num <= 3) {
                return "#4F00C6";
            }
            else if (num <= 4) {
                return "#8D00CA";
            }
            else if (num <= 5) {
                return "#CE00CE";
            }
            else if (num <= 6) {
                return "#D20092";
            }
            else if (num <= 7) {
                return "#D50055";
            }
            else if (num <= 8) {
                return "#D90015";
            }
            else if (num <= 9) {
                return "#DD2C00";
            }
            else if (num <= 10) {
                return "#E17000";
            }
            return "#E5B600";
        };
        MapsDataLoader.prototype.mapToViewData = function () {
            var _this = this;
            var places = _.map(this.places.places, function (place) {
                var point = new Maps.PlaceMarker(place.Location.Lat, place.Location.Lng);
                return point;
            });
            this.viewPlaces.places = places;
            var countries = _.map(this.places.countries, function (country) {
                var colorConfig = new Maps.PolygonConfig();
                var countryVisits = null;
                if (country.Dates) {
                    countryVisits = country.Dates.length;
                }
                colorConfig.fillColor = _this.getColorByNumber(countryVisits);
                var countryOut = new Maps.CountryHighligt();
                countryOut.countryCode = country.CountryCode2;
                countryOut.countryConfig = colorConfig;
                return countryOut;
            });
            this.viewPlaces.countries = countries;
            var cities = _.map(this.places.cities, function (city) {
                var marker = new Maps.PlaceMarker(city.Location.Lat, city.Location.Lng);
                return marker;
            });
            this.viewPlaces.cities = cities;
        };
        return MapsDataLoader;
    })();
    Maps.MapsDataLoader = MapsDataLoader;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsDataLoader.js.map