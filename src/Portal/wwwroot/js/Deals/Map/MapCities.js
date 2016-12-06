var Planning;
(function (Planning) {
    var MapPosition = (function () {
        function MapPosition(mapObj) {
            this.mapObj = mapObj;
        }
        MapPosition.prototype.setPos = function (obj) {
            this.mapObj.setZoom(obj.z);
            this.mapObj.panTo(obj.c, { animate: false });
        };
        MapPosition.prototype.getPos = function () {
            var c = this.mapObj.getCenter();
            var z = this.mapObj.getZoom();
            return { c: c, z: z };
        };
        return MapPosition;
    }());
    Planning.MapPosition = MapPosition;
    var MapCities = (function () {
        function MapCities(map) {
            this.citiesToMarkers = [];
            this.cities = [];
            this.$map = $("#mapCities");
            this.inited = false;
            this.map = map;
        }
        MapCities.prototype.show = function () {
            this.$map.show();
            if (!this.inited) {
                this.init();
                this.inited = true;
                this.initCities();
            }
        };
        MapCities.prototype.hide = function () {
            this.$map.hide();
        };
        MapCities.prototype.init = function () {
            this.mapObj = L.map("mapCities", Planning.MapConstants.mapOptions);
            this.position = new MapPosition(this.mapObj);
            this.createMapboxLayer();
            this.citiesLayerGroup = L.layerGroup();
            this.mapObj.addLayer(this.citiesLayerGroup);
        };
        MapCities.prototype.initCities = function () {
            this.loadCitiesInRange();
            this.callToLoadCities();
        };
        MapCities.prototype.createMapboxLayer = function () {
            var tempUrl = "https://api.mapbox.com/styles/v1/gloobster/civo64vmw004i2kqkwpcocjyp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
            this.tileLayer = L.tileLayer(tempUrl, Planning.MapConstants.tileOptions);
            this.mapObj.addLayer(this.tileLayer);
        };
        MapCities.prototype.getPopulationFromZoom = function (zoom) {
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
        MapCities.prototype.callToLoadCities = function () {
            var _this = this;
            var bounds = this.mapObj.getBounds();
            var zoom = this.mapObj.getZoom();
            var population = this.getPopulationFromZoom(zoom);
            var customId = this.map.planningMap.v.currentSetter.getCustomId();
            var prms = [
                ["latSouth", bounds._southWest.lat],
                ["lngWest", bounds._southWest.lng],
                ["latNorth", bounds._northEast.lat],
                ["lngEast", bounds._northEast.lng],
                ["minPopulation", population.toString()],
                ["planningType", this.map.planningMap.planningType.toString()],
                ["customId", customId]
            ];
            Views.ViewBase.currentView.apiGet("airportGroup", prms, function (cities) {
                _this.createCities(cities);
            });
        };
        MapCities.prototype.createCities = function (cities) {
            var _this = this;
            this.cities = cities;
            this.citiesToMarkers = [];
            if (this.citiesLayerGroup) {
                this.citiesLayerGroup.clearLayers();
            }
            cities.forEach(function (city) {
                var cityMarker = _this.createCity(city);
            });
        };
        MapCities.prototype.createCity = function (city) {
            var _this = this;
            var icon = city.selected ? MapIcons.selected : MapIcons.default;
            var marker = L.marker([city.coord.Lat, city.coord.Lng], { icon: icon });
            marker.selected = city.selected;
            marker.gid = city.gid;
            marker.on("mouseover", function (e) {
                e.target.setIcon(MapIcons.focus);
            });
            marker.on("mouseout", function (e) {
                if (!e.target.selected) {
                    e.target.setIcon(MapIcons.default);
                }
                else {
                    e.target.setIcon(MapIcons.selected);
                }
            });
            marker.on("click", function (e) {
                _this.cityClicked(e);
            });
            marker.addTo(this.citiesLayerGroup);
            return marker;
        };
        MapCities.prototype.cityClicked = function (e) {
            if (!this.map.planningMap.v.hasAirs) {
                this.map.planningMap.v.showAirsFirst();
                return;
            }
            e.target.setIcon(MapIcons.selected);
            e.target.selected = !e.target.selected;
            this.map.onCityChange(e.target.gid, e.target.selected);
        };
        MapCities.prototype.loadCitiesInRange = function () {
            var _this = this;
            this.delayedCallback = new DelayedCallbackMap();
            this.delayedCallback.callback = function () {
                _this.callToLoadCities();
            };
            this.mapObj.on("zoomend", function (e) {
                _this.delayedCallback.receiveEvent();
            });
            this.mapObj.on("moveend", function (e) {
                _this.delayedCallback.receiveEvent();
            });
        };
        return MapCities;
    }());
    Planning.MapCities = MapCities;
    var MapIcons = (function () {
        function MapIcons() {
        }
        MapIcons.basePath = "../../images/n/map-icons/";
        MapIcons.default = L.icon({
            iconUrl: MapIcons.basePath + "default.svg",
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        MapIcons.selected = L.icon({
            iconUrl: MapIcons.basePath + "selected.svg",
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        MapIcons.focus = L.icon({
            iconUrl: MapIcons.basePath + "focus.svg",
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        return MapIcons;
    }());
    Planning.MapIcons = MapIcons;
    var DelayedCallbackMap = (function () {
        function DelayedCallbackMap() {
            this.delay = 600;
            this.timeoutId = null;
        }
        DelayedCallbackMap.prototype.receiveEvent = function () {
            var _this = this;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.timeoutId = setTimeout(function () {
                _this.timeoutId = null;
                _this.callback();
            }, this.delay);
        };
        return DelayedCallbackMap;
    }());
    Planning.DelayedCallbackMap = DelayedCallbackMap;
})(Planning || (Planning = {}));
//# sourceMappingURL=MapCities.js.map