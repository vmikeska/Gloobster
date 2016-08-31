var Maps;
(function (Maps) {
    var MapsManager = (function () {
        function MapsManager() {
            var _this = this;
            this.mapsDataLoader = new Maps.MapsDataLoader();
            this.mapsDataLoader.dataLoadedCallback = function () { _this.redrawDataCallback(); };
            this.mapsOperations = new Maps.MapsOperations();
        }
        MapsManager.prototype.getPluginData = function (dataType, people) {
            this.currentDataType = dataType;
            this.mapsDataLoader.getPluginData(dataType, people);
        };
        MapsManager.prototype.redrawDataCallback = function () {
            if (this.currentDataType === Maps.DataType.Cities) {
                this.redrawCities();
            }
            if (this.currentDataType === Maps.DataType.Countries) {
                this.redrawCountries();
            }
            if (this.currentDataType === Maps.DataType.Places) {
                this.redrawPlaces();
            }
            this.onDataChanged();
        };
        MapsManager.prototype.removeCity = function (gid, countryCode) {
            if (countryCode === void 0) { countryCode = null; }
            this.mapsOperations.removeCity(gid);
            this.mapsDataLoader.viewPlaces.cities = _.reject(this.mapsDataLoader.viewPlaces.cities, function (c) {
                return c.geoNamesId === gid;
            });
            if (countryCode) {
                this.mapsDataLoader.viewPlaces.countries = _.reject(this.mapsDataLoader.viewPlaces.countries, function (pol) {
                    return pol.countryCode === countryCode;
                });
            }
        };
        MapsManager.prototype.redrawPlaces = function () {
            this.mapsDriver.destroyAll();
            this.mapsOperations.drawPlaces(this.mapsDataLoader.viewPlaces.places);
        };
        MapsManager.prototype.redrawCities = function () {
            this.mapsDriver.destroyAll();
            this.mapsOperations.drawCities(this.mapsDataLoader.viewPlaces.cities);
        };
        MapsManager.prototype.redrawCountries = function () {
            this.mapsDriver.destroyAll();
            var countries = this.mapsDataLoader.viewPlaces.countries;
            var doUsThing = true;
            if (doUsThing) {
                var us = _.find(countries, function (c) {
                    return c.countryCode === "US";
                });
                var hasUs = us != null;
                if (hasUs) {
                    countries = _.reject(countries, function (c) { return c === us; });
                    this.mapsOperations.drawUsStates(this.mapsDataLoader.viewPlaces.states);
                }
            }
            this.mapsOperations.drawCountries(countries);
        };
        MapsManager.prototype.switchToView = function (viewType, dataType, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            if (this.currentViewType === viewType) {
                return;
            }
            var savedPosition;
            var savedZoom = 1;
            if (this.mapsDriver) {
                savedPosition = this.mapsDriver.getPosition();
                savedZoom = this.mapsDriver.getZoom();
            }
            if (this.currentMaps) {
                this.currentMaps.hide();
                this.mapsDriver.destroyAll();
            }
            this.currentViewType = viewType;
            this.initView(viewType);
            this.currentMaps.show(function () {
                _this.onMapsLoaded(savedPosition, savedZoom, dataType);
                if (callback) {
                    callback();
                }
            });
        };
        MapsManager.prototype.onMapsLoaded = function (savedPosition, savedZoom, dataType) {
            this.mapsOperations.setBaseMapsOperations(this.mapsDriver);
            this.mapsDriver.setMapObj(this.currentMaps.mapObj);
            this.displayData(savedPosition, savedZoom, dataType);
        };
        MapsManager.prototype.initView = function (viewType) {
            if (viewType === Maps.MapType.D3) {
                this.init3D();
            }
            if (viewType === Maps.MapType.D2) {
                this.init2D();
            }
        };
        MapsManager.prototype.displayData = function (savedPosition, savedZoom, dataType) {
            var people = new Maps.PeopleSelection();
            people.me = true;
            people.everybody = false;
            people.friends = false;
            people.singleFriends = [];
            this.getPluginData(dataType, people);
            if (savedPosition) {
                var roundedZoom = Math.round(savedZoom);
                this.mapsDriver.setView(savedPosition.lat, savedPosition.lng, roundedZoom);
            }
        };
        MapsManager.prototype.init3D = function () {
            this.currentMaps = new Maps.MapsCreatorGlobe3D();
            this.currentMaps.setRootElement('map');
            this.mapsDriver = new Maps.BaseMapsOperation3D();
        };
        MapsManager.prototype.init2D = function () {
            var _this = this;
            this.currentMaps = new Maps.MapsCreatorMapBox2D();
            this.currentMaps.setRootElement("map");
            this.currentMaps.onCenterChanged = function (center) {
                if (_this.onCenterChanged) {
                    _this.onCenterChanged(center);
                }
            };
            this.mapsDriver = new Maps.BaseMapsOperation2D();
        };
        return MapsManager;
    }());
    Maps.MapsManager = MapsManager;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsManager.js.map