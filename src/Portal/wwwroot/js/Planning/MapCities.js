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
            this.graph = new Planning.GraphicConfig();
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
        MapCities.prototype.set = function (cities) {
            this.cities = cities;
            if (this.inited) {
                this.initCities();
            }
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
            this.delayedZoomCallback.receiveEvent();
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
            var prms = [
                ["latSouth", bounds._southWest.lat],
                ["lngWest", bounds._southWest.lng],
                ["latNorth", bounds._northEast.lat],
                ["lngEast", bounds._northEast.lng],
                ["minPopulation", population.toString()],
                ["planningType", this.map.planningMap.planningType.toString()]
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
                _this.cityClicked(e);
            });
            marker.addTo(this.citiesLayerGroup);
            return marker;
        };
        MapCities.prototype.cityClicked = function (e) {
            e.target.setIcon(this.graph.selectedIcon);
            e.target.selected = !e.target.selected;
            this.map.onCityChange(e.target.gid, e.target.selected);
        };
        MapCities.prototype.loadCitiesInRange = function () {
            var _this = this;
            this.delayedZoomCallback = new Planning.DelayedCallbackMap();
            this.delayedZoomCallback.callback = function () {
                _this.callToLoadCities();
            };
            this.mapObj.on("zoomend", function (e) {
                _this.delayedZoomCallback.receiveEvent();
            });
            this.mapObj.on("moveend", function (e) {
                _this.delayedZoomCallback.receiveEvent();
            });
        };
        return MapCities;
    }());
    Planning.MapCities = MapCities;
})(Planning || (Planning = {}));
//# sourceMappingURL=MapCities.js.map