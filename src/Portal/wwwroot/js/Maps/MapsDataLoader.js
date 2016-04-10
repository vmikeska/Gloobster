var Maps;
(function (Maps) {
    var MapsDataLoader = (function () {
        function MapsDataLoader() {
        }
        MapsDataLoader.prototype.getPluginData = function (dataType, displayEntity, people) {
            var _this = this;
            var request = [
                ["dataType", dataType.toString()],
                ["displayEntity", displayEntity.toString()]
            ];
            request = $.merge(request, [
                ["me", people.me.toString()],
                ["friends", people.friends.toString()],
                ["everybody", people.everybody.toString()],
                ["singleFriends", people.singleFriends.join()]
            ]);
            Views.ViewBase.currentView.apiGet("PinBoardStats", request, function (response) {
                _this.places = new Maps.Places();
                _this.viewPlaces = new Maps.PlacesDisplay();
                _this.places.places = response.visitedPlaces;
                _this.places.cities = response.visitedCities;
                _this.places.countries = response.visitedCountries;
                _this.places.states = response.visitedStates;
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
                var point = new Maps.PlaceMarker();
                point.lat = place.Location.Lat;
                point.lng = place.Location.Lng;
                return point;
            });
            this.viewPlaces.places = places;
            var countries = _.map(this.places.countries, function (country) {
                var colorConfig = new Maps.PolygonConfig();
                colorConfig.fillColor = _this.getColorByNumber(country.Count);
                colorConfig.countryCode = country.CountryCode2;
                var countryOut = new Maps.CountryHighligt();
                countryOut.countryCode = country.CountryCode2;
                countryOut.countryConfig = colorConfig;
                return countryOut;
            });
            this.viewPlaces.countries = countries;
            var states = _.map(this.places.states, function (state) {
                var colorConfig = new Maps.PolygonConfig();
                colorConfig.fillColor = _this.getColorByNumber(state.Count);
                colorConfig.countryCode = state.StateCode;
                var stateOut = new Maps.CountryHighligt();
                stateOut.countryCode = state.StateCode;
                stateOut.countryConfig = colorConfig;
                return stateOut;
            });
            this.viewPlaces.states = states;
            var cities = _.map(this.places.cities, function (city) {
                var marker = new Maps.PlaceMarker();
                marker.city = city.City;
                marker.dates = city.Dates;
                marker.lat = city.Location.Lat;
                marker.lng = city.Location.Lng;
                marker.geoNamesId = city.GeoNamesId;
                return marker;
            });
            this.viewPlaces.cities = cities;
        };
        return MapsDataLoader;
    })();
    Maps.MapsDataLoader = MapsDataLoader;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsDataLoader.js.map