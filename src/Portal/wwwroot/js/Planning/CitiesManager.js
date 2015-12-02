var Planning;
(function (Planning) {
    var CitiesManager = (function () {
        function CitiesManager(map, graph) {
            this.cities = [];
            this.citiesToMarkers = [];
            this.graph = graph;
            this.map = map;
            this.citiesLayerGroup = L.layerGroup();
            this.map.addLayer(this.citiesLayerGroup);
        }
        CitiesManager.prototype.createCities = function (cities, planningType) {
            var _this = this;
            this.currentPlanningType = planningType;
            this.cities = cities;
            var filteredCities = _.filter(cities, function (city) {
                return !_.contains(_this.countriesManager.selectedCountries, city.countryCode);
            });
            this.citiesToMarkers = [];
            this.citiesLayerGroup.clearLayers();
            filteredCities.forEach(function (city) {
                var cityMarker = _this.createCity(city);
                _this.addCityToMarker(city, cityMarker);
            });
        };
        CitiesManager.prototype.hideCityMarkersByCountry = function (countryCode) {
            var _this = this;
            var cityMarkerPairs = this.getCitiesMarkersByCountry(countryCode);
            cityMarkerPairs.forEach(function (pair) {
                _this.citiesLayerGroup.removeLayer(pair.marker);
                pair = null;
            });
            this.citiesToMarkers = _.reject(this.citiesToMarkers, function (i) { return i === null; });
        };
        CitiesManager.prototype.showCityMarkersByCountry = function (countryCode) {
            var _this = this;
            var cities = this.getCitiesByCountry(countryCode);
            cities.forEach(function (city) {
                var cityMarker = _this.createCity(city);
                _this.addCityToMarker(city, cityMarker);
            });
        };
        CitiesManager.prototype.addCityToMarker = function (city, marker) {
            this.citiesToMarkers.push({ city: city, marker: marker });
        };
        CitiesManager.prototype.getCitiesMarkersByCountry = function (countryCode) {
            var pairs = _.filter(this.citiesToMarkers, function (pair) { return pair.city.countryCode === countryCode; });
            return pairs;
        };
        CitiesManager.prototype.getCitiesByCountry = function (countryCode) {
            var cities = _.filter(this.cities, function (city) { return city.countryCode === countryCode; });
            return cities;
        };
        CitiesManager.prototype.createCity = function (city) {
            var _this = this;
            var icon = city.selected ? this.graph.selectedIcon : this.graph.cityIcon;
            var marker = L.marker([city.coord.Lat, city.coord.Lng], { icon: icon });
            marker.selected = city.selected;
            marker.gid = city.gid;
            marker.on("mouseover", function (e) {
                e.target.setIcon(_this.graph.focusIcon);
            });
            marker.on("mouseout", function (e) {
                if (!e.target.selected) {
                    e.target.setIcon(_this.graph.cityIcon);
                }
                else {
                    e.target.setIcon(_this.graph.selectedIcon);
                }
            });
            marker.on("click", function (e) {
                _this.callChangeCitySelection(_this.currentPlanningType, e.target.gid, !e.target.selected, function (res) {
                    e.target.setIcon(_this.graph.selectedIcon);
                    e.target.selected = !e.target.selected;
                });
            });
            marker.addTo(this.citiesLayerGroup);
            return marker;
        };
        CitiesManager.prototype.callChangeCitySelection = function (planningType, gid, selected, callback) {
            var data = Planning.PlanningSender.createRequest(planningType, "cities", {
                gid: gid,
                selected: selected
            });
            if (planningType === Planning.PlanningType.Custom) {
                data.values.customId = Planning.NamesList.selectedSearch.id;
            }
            Planning.PlanningSender.updateProp(data, function (response) {
                callback(response);
            });
        };
        return CitiesManager;
    })();
    Planning.CitiesManager = CitiesManager;
})(Planning || (Planning = {}));
//# sourceMappingURL=CitiesManager.js.map