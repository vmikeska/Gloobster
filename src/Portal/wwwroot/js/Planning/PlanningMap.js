var Planning;
(function (Planning) {
    var PlanningMap = (function () {
        function PlanningMap() {
            this.viewType = FlightCacheRecordType.Country;
            this.initMap();
            this.initCountriesFnc();
            this.initCitiesFnc();
        }
        PlanningMap.prototype.changeViewType = function (type) {
            this.viewType = type;
            this.displayMapData();
        };
        PlanningMap.prototype.initMap = function () {
            var _this = this;
            this.map = new Planning.Map();
            this.map.init("map");
            this.map.onMapLoaded = function () {
                _this.loadCategory(PlanningType.Anytime);
                _this.onMapLoaded();
            };
        };
        PlanningMap.prototype.initCountriesFnc = function () {
            var _this = this;
            this.map.onCountryChange = function (cc, isSelected) {
                _this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);
                var data = Planning.PlanningSender.createRequest(_this.planningType, "countries", {
                    countryCode: cc,
                    selected: isSelected
                });
                Planning.PlanningSender.updateProp(data, function (response) {
                });
            };
        };
        PlanningMap.prototype.initCitiesFnc = function () {
            var _this = this;
            this.citiesManager = new Planning.CitiesManager(this.map.mapObj);
            this.citiesManager.onSelectionChanged = function (id, newState, type) {
                _this.onSelectionChanged(id, newState, type);
            };
        };
        PlanningMap.prototype.loadCategory = function (pt) {
            this.planningType = pt;
            this.initData();
        };
        PlanningMap.prototype.initData = function () {
            var _this = this;
            this.getTabData(this.planningType, function (data) {
                _this.viewData = data;
                _this.displayMapData();
            });
        };
        PlanningMap.prototype.displayMapData = function () {
            if (this.viewType === FlightCacheRecordType.Country) {
                this.map.setCountries(this.viewData.countryCodes);
            }
            else {
                this.loadCitiesInRange();
                this.delayedZoomCallback.receiveEvent();
            }
        };
        PlanningMap.prototype.getTabData = function (planningType, callback) {
            var prms = [["planningType", planningType.toString()]];
            Views.ViewBase.currentView.apiGet("PlanningProperty", prms, function (response) {
                callback(response);
            });
        };
        PlanningMap.prototype.loadCitiesInRange = function () {
            var _this = this;
            this.delayedZoomCallback = new Planning.DelayedCallbackMap();
            this.delayedZoomCallback.callback = function () {
                _this.callToLoadCities();
            };
            this.map.mapObj.on("zoomend", function (e) {
                _this.delayedZoomCallback.receiveEvent();
            });
            this.map.mapObj.on("moveend", function (e) {
                _this.delayedZoomCallback.receiveEvent();
            });
        };
        PlanningMap.prototype.callToLoadCities = function () {
            var _this = this;
            var bounds = this.map.mapObj.getBounds();
            var zoom = this.map.mapObj.getZoom();
            var population = this.getPopulationFromZoom(zoom);
            var prms = [
                ["latSouth", bounds._southWest.lat],
                ["lngWest", bounds._southWest.lng],
                ["latNorth", bounds._northEast.lat],
                ["lngEast", bounds._northEast.lng],
                ["minPopulation", population.toString()],
                ["planningType", this.planningType.toString()]
            ];
            Views.ViewBase.currentView.apiGet("airportGroup", prms, function (response) {
                _this.onCitiesResponse(response);
            });
        };
        PlanningMap.prototype.onCitiesResponse = function (cities) {
            this.citiesManager.createCities(cities, this.planningType);
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
        return PlanningMap;
    }());
    Planning.PlanningMap = PlanningMap;
})(Planning || (Planning = {}));
//# sourceMappingURL=PlanningMap.js.map