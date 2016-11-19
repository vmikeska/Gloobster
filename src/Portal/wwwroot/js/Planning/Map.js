var Planning;
(function (Planning) {
    var MapConstants = (function () {
        function MapConstants() {
        }
        MapConstants.mapOptions = {
            zoom: 3,
            maxZoom: 19,
            minZoom: 3,
            maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
            zoomControl: false,
            center: [34.5133, -94.1629]
        };
        MapConstants.tileOptions = {
            noWrap: true,
        };
        MapConstants.unselCountryStyle = {
            color: "#9096a0",
            weight: 1,
            opacity: 1,
            fillColor: "#005476",
            fillOpacity: 1
        };
        MapConstants.selCountryStyle = {
            color: "#9096a0",
            weight: 1,
            opacity: 1,
            fillColor: "#3DA243",
            fillOpacity: 1
        };
        MapConstants.hoverStyle = {
            fillColor: "#F56E12",
            fillOpacity: 1
        };
        return MapConstants;
    }());
    Planning.MapConstants = MapConstants;
    var Map = (function () {
        function Map(planningMap) {
            this.planningMap = planningMap;
        }
        Map.prototype.init = function (contId) {
            this.mapCountries = new MapCountries(this);
            this.mapCities = new MapCities(this);
            this.mapObj = L.map(contId, MapConstants.mapOptions);
            this.onMapLoaded();
        };
        Map.prototype.switch = function (type, data) {
            var _this = this;
            if (type === FlightCacheRecordType.Country) {
                this.mapCities.destroy();
                this.mapCountries.init(function () {
                    _this.mapCountries.set(data);
                });
            }
            if (type === FlightCacheRecordType.City) {
                this.mapCountries.destroy();
                this.mapCities.init();
                this.mapCities.set(data);
            }
        };
        Map.prototype.countrySelChanged = function (cc, isSelected) {
            if (this.onCountryChange) {
                this.onCountryChange(cc, isSelected);
            }
        };
        return Map;
    }());
    Planning.Map = Map;
    var MapCities = (function () {
        function MapCities(map) {
            this.citiesToMarkers = [];
            this.cities = [];
            this.map = map;
            this.graph = new Planning.GraphicConfig();
        }
        MapCities.prototype.init = function () {
            this.createMapboxLayer();
            this.citiesLayerGroup = L.layerGroup();
            this.map.mapObj.addLayer(this.citiesLayerGroup);
        };
        MapCities.prototype.set = function (cities) {
            this.loadCitiesInRange();
            this.delayedZoomCallback.receiveEvent();
        };
        MapCities.prototype.destroy = function () {
            if (this.citiesLayerGroup) {
                this.citiesLayerGroup.clearLayers();
                this.map.mapObj.removeLayer(this.citiesLayerGroup);
                this.citiesLayerGroup = null;
            }
            this.destroyMapboxLayer();
        };
        MapCities.prototype.destroyMapboxLayer = function () {
            if (this.tileLayer) {
                this.map.mapObj.removeLayer(this.tileLayer);
                this.tileLayer = null;
            }
        };
        MapCities.prototype.createMapboxLayer = function () {
            var tempUrl = "https://api.mapbox.com/styles/v1/gloobster/civo64vmw004i2kqkwpcocjyp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
            this.tileLayer = L.tileLayer(tempUrl, MapConstants.tileOptions);
            this.map.mapObj.addLayer(this.tileLayer);
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
            var bounds = this.map.mapObj.getBounds();
            var zoom = this.map.mapObj.getZoom();
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
            this.map.mapObj.on("zoomend", function (e) {
                _this.delayedZoomCallback.receiveEvent();
            });
            this.map.mapObj.on("moveend", function (e) {
                _this.delayedZoomCallback.receiveEvent();
            });
        };
        return MapCities;
    }());
    Planning.MapCities = MapCities;
    var MapCountries = (function () {
        function MapCountries(map) {
            this.selectedCountries = [];
            this.featureArray = [];
            this.map = map;
        }
        MapCountries.prototype.set = function (ccs) {
            this.selectedCountries = ccs;
            this.featureArray.forEach(function (i) {
                var cc = i[0];
                var f = i[1];
                var isSelected = _.contains(ccs, cc);
                if (isSelected) {
                    f.setStyle(MapConstants.selCountryStyle);
                }
                else {
                    f.setStyle(MapConstants.unselCountryStyle);
                }
            });
        };
        MapCountries.prototype.init = function (callback) {
            var _this = this;
            this.getGeoJson(function () {
                _this.createMapboxLayer();
                _this.createCountries();
                callback();
            });
        };
        MapCountries.prototype.destroy = function () {
            this.destroyMapboxLayer();
            this.destroyCountries();
        };
        MapCountries.prototype.createCountries = function () {
            var _this = this;
            this.ccsLayerGroup = L.layerGroup();
            this.map.mapObj.addLayer(this.ccsLayerGroup);
            $(this.countriesData.features)
                .each(function (key, feature) {
                _this.createMapFeature(feature);
            });
        };
        MapCountries.prototype.destroyCountries = function () {
            this.ccsLayerGroup.clearLayers();
            this.map.mapObj.removeLayer(this.ccsLayerGroup);
            this.ccsLayerGroup = null;
            this.featureArray = [];
        };
        MapCountries.prototype.createMapFeature = function (feature) {
            var _this = this;
            var cc = feature.properties.iso_a2;
            var l = new L.GeoJSON(feature, {
                style: this.getCountryStyle(cc)
            });
            this.featureArray.push([cc, l]);
            l.addTo(this.ccsLayerGroup);
            l.on("mouseover", function (e) {
                var layer = _this.getLayer(e);
                layer.setStyle(MapConstants.hoverStyle);
            });
            l.on("mouseout", function (e) {
                var layer = _this.getLayer(e);
                var s = _this.getCountryStyle(cc);
                layer.setStyle(s);
            });
            l.on("click", function (e) {
                var layer = _this.getLayer(e);
                _this.countryClicked(cc, layer);
            });
        };
        MapCountries.prototype.countryClicked = function (cc, layer) {
            var selected = this.isCountrySelected(cc);
            if (selected) {
                this.selectedCountries = _.reject(this.selectedCountries, function (c) { return c === cc; });
            }
            else {
                this.selectedCountries.push(cc);
            }
            var s = this.getCountryStyle(cc);
            layer.setStyle(s);
            this.map.countrySelChanged(cc, !selected);
        };
        MapCountries.prototype.destroyMapboxLayer = function () {
            this.map.mapObj.removeLayer(this.mapLayer);
            this.mapLayer = null;
        };
        MapCountries.prototype.createMapboxLayer = function () {
            var tempUrl = "https://api.mapbox.com/styles/v1/gloobster/civi2b1wn00a82kpattor5wui/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
            this.mapLayer = L.tileLayer(tempUrl, MapConstants.tileOptions);
            this.map.mapObj.addLayer(this.mapLayer);
            var paneName = "leaflet-top-pane";
            var pane = this.map.mapObj.getPane(paneName);
            if (!pane) {
                this.mapboxPane = this.map.mapObj.createPane(paneName);
            }
            this.mapboxPane.appendChild(this.mapLayer.getContainer());
            this.mapLayer.setZIndex(5);
        };
        MapCountries.prototype.getCountryStyle = function (cc) {
            if (this.isCountrySelected(cc)) {
                return MapConstants.selCountryStyle;
            }
            else {
                return MapConstants.unselCountryStyle;
            }
        };
        MapCountries.prototype.isCountrySelected = function (cc) {
            var selected = _.contains(this.selectedCountries, cc);
            return selected;
        };
        MapCountries.prototype.getGeoJson = function (callback) {
            var _this = this;
            if (this.countriesData) {
                callback();
            }
            else {
                $.ajax({
                    dataType: "json",
                    url: "/geo/custom.geo.json",
                    success: function (data) {
                        _this.countriesData = data;
                        callback();
                    }
                })
                    .error(function () { alert("error voe"); });
            }
        };
        MapCountries.prototype.getLayer = function (e) {
            var id = e.layer._leaflet_id;
            var layer = this.map.mapObj._layers[id];
            return layer;
        };
        return MapCountries;
    }());
    Planning.MapCountries = MapCountries;
})(Planning || (Planning = {}));
//# sourceMappingURL=Map.js.map