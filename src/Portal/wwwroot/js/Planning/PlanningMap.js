var Planning;
(function (Planning) {
    var PlanningMap = (function () {
        function PlanningMap(map) {
            var _this = this;
            this.map = map;
            this.graph = new Planning.GraphicConfig();
            this.citiesManager = new Planning.CitiesManager(map, this.graph);
            this.citiesManager.onSelectionChanged = function (id, newState, type) { return _this.onSelectionChanged(id, newState, type); };
            this.countriesManager = new Planning.CountriesManager(map, this.graph);
            this.countriesManager.onSelectionChanged = function (id, newState, type) { return _this.onSelectionChanged(id, newState, type); };
            this.citiesManager.countriesManager = this.countriesManager;
            this.countriesManager.citiesManager = this.citiesManager;
            var weekendDisplay = new Planning.WeekendDisplay();
            this.resultsEngine = new Planning.ResultsManager();
            this.resultsEngine.initalCall();
            this.resultsEngine.onConnectionsChanged = function (connections) {
                weekendDisplay.displayByWeek(connections);
            };
        }
        PlanningMap.prototype.loadCategory = function (planningType) {
            this.currentPlanningType = planningType;
            this.initCategory();
            this.loadCitiesInRange();
            this.delayedZoomCallback.receiveEvent();
        };
        PlanningMap.prototype.loadCitiesInRange = function () {
            var _this = this;
            this.delayedZoomCallback = new Planning.DelayedCallbackMap();
            this.delayedZoomCallback.callback = function () {
                _this.callToLoadCities();
            };
            this.map.on("zoomend", function (e) {
                _this.delayedZoomCallback.receiveEvent();
            });
            this.map.on("moveend", function (e) {
                _this.delayedZoomCallback.receiveEvent();
            });
        };
        PlanningMap.prototype.callToLoadCities = function () {
            var _this = this;
            var bounds = this.map.getBounds();
            var zoom = this.map.getZoom();
            var population = this.getPopulationFromZoom(zoom);
            var prms = [
                ["latSouth", bounds._southWest.lat],
                ["lngWest", bounds._southWest.lng],
                ["latNorth", bounds._northEast.lat],
                ["lngEast", bounds._northEast.lng],
                ["minPopulation", population],
                ["planningType", this.currentPlanningType.toString()]
            ];
            if (this.currentPlanningType === Planning.PlanningType.Custom) {
                prms.push(["customId", Planning.NamesList.selectedSearch.id]);
            }
            Views.ViewBase.currentView.apiGet("airportGroup", prms, function (response) {
                _this.onCitiesResponse(response);
            });
        };
        PlanningMap.prototype.initCategory = function () {
            var _this = this;
            this.getTabData(this.currentPlanningType, function (data) {
                _this.viewData = data;
                if (_this.currentPlanningType === Planning.PlanningType.Anytime) {
                    _this.countriesManager.createCountries(_this.viewData.countryCodes, _this.currentPlanningType);
                }
                if (_this.currentPlanningType === Planning.PlanningType.Weekend) {
                    _this.countriesManager.createCountries(_this.viewData.countryCodes, _this.currentPlanningType);
                    _this.weekendForm = new Planning.WeekendForm(data);
                }
                if (_this.currentPlanningType === Planning.PlanningType.Custom) {
                    var search = _this.viewData.searches[0];
                    _this.countriesManager.createCountries(search.countryCodes, _this.currentPlanningType);
                    _this.customForm = new Planning.CustomForm(data, _this);
                }
            });
        };
        PlanningMap.prototype.getTabData = function (planningType, callback) {
            var prms = [["planningType", planningType.toString()]];
            Views.ViewBase.currentView.apiGet("PlanningProperty", prms, function (response) {
                callback(response);
            });
        };
        PlanningMap.prototype.onCitiesResponse = function (cities) {
            this.citiesManager.createCities(cities, this.currentPlanningType);
        };
        PlanningMap.prototype.getPopulationFromZoom = function (zoom) {
            if (zoom < 3) {
                return 2000000;
            }
            if (zoom === 3) {
                return 800000;
            }
            if (zoom === 4) {
                return 600000;
            }
            if (zoom === 5) {
                return 400000;
            }
            if (zoom === 6) {
                return 200000;
            }
            if (zoom === 7) {
                return 50000;
            }
            return 1;
        };
        PlanningMap.prototype.onSelectionChanged = function (id, newState, type) {
            if (newState) {
                this.resultsEngine.selectionChanged(id, newState, type);
            }
        };
        return PlanningMap;
    }());
    Planning.PlanningMap = PlanningMap;
})(Planning || (Planning = {}));
//# sourceMappingURL=PlanningMap.js.map