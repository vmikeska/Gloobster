var Planning;
(function (Planning) {
    var CountriesManager = (function () {
        function CountriesManager(map, graph) {
            this.selectedCountries = [];
            this.graph = graph;
            this.map = map;
            this.countriesLayerGroup = L.layerGroup();
            this.map.addLayer(this.countriesLayerGroup);
            this.countryShapes = new Common.CountryShapes();
        }
        CountriesManager.prototype.createCountries = function (selectedCountries, planningType) {
            var _this = this;
            this.currentPlanningType = planningType;
            this.countriesLayerGroup.clearLayers();
            this.selectedCountries = selectedCountries;
            this.countryShapes.countriesList.forEach(function (country) {
                var selected = _.contains(selectedCountries, country.name);
                var config = selected ? _this.graph.selectedConfig : _this.graph.unselectedConfig;
                _this.createCountry(country, config);
            });
        };
        CountriesManager.prototype.createCountry = function (country, polygonConfig) {
            var _this = this;
            var polygon = L.polygon(country.coordinates, polygonConfig.convert());
            polygon.addTo(this.countriesLayerGroup);
            polygon.countryCode = country.name;
            polygon.on("click", function (e) {
                var countryCode = e.target.countryCode;
                var wasSelected = _.contains(_this.selectedCountries, countryCode);
                var newFillColor = wasSelected ? _this.graph.fillColorUnselected : _this.graph.fillColorSelected;
                _this.callChangeCountrySelection(_this.currentPlanningType, countryCode, !wasSelected, function (response) {
                    e.target.setStyle({ fillColor: newFillColor });
                    if (wasSelected) {
                        _this.selectedCountries = _.reject(_this.selectedCountries, function (cntry) { return cntry === countryCode; });
                        _this.citiesManager.showCityMarkersByCountry(countryCode);
                    }
                    else {
                        _this.selectedCountries.push(countryCode);
                        _this.citiesManager.hideCityMarkersByCountry(countryCode);
                    }
                });
            });
            polygon.on("mouseover", function (e) {
                e.target.setStyle({ fillColor: _this.graph.fillColorHover });
            });
            polygon.on("mouseout", function (e) {
                var countryCode = e.target.countryCode;
                var selected = _.contains(_this.selectedCountries, countryCode);
                var fillColor = selected ? _this.graph.fillColorSelected : _this.graph.fillColorUnselected;
                e.target.setStyle({ fillColor: fillColor });
            });
        };
        CountriesManager.prototype.callChangeCountrySelection = function (planningType, countryCode, selected, callback) {
            var data = Planning.PlanningSender.createRequest(planningType, "countries", {
                countryCode: countryCode,
                selected: selected
            });
            if (planningType === Planning.PlanningType.Custom) {
                data.values.customId = Planning.NamesList.selectedSearch.id;
            }
            Planning.PlanningSender.updateProp(data, function (response) {
                callback(response);
            });
        };
        return CountriesManager;
    }());
    Planning.CountriesManager = CountriesManager;
})(Planning || (Planning = {}));
//# sourceMappingURL=CountriesManager.js.map