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
        function Map() {
        }
        Map.prototype.init = function (contId) {
            var _this = this;
            this.mapCountries = new MapCountries(this);
            this.mapObj = L.map(contId, MapConstants.mapOptions);
            this.mapCountries.init(function () {
                if (_this.onMapLoaded) {
                    _this.onMapLoaded();
                }
            });
        };
        Map.prototype.setCountries = function (ccs) {
            this.mapCountries.set(ccs);
        };
        Map.prototype.countrySelChanged = function (cc, isSelected) {
            if (this.onCountryChange) {
                this.onCountryChange(cc, isSelected);
            }
        };
        return Map;
    }());
    Planning.Map = Map;
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
            if (this.countriesData) {
                this.createMapboxLayer();
                callback();
            }
            else {
                this.getGeoJson(function (countries) {
                    _this.createMapboxLayer();
                    _this.createCountries(countries);
                    callback();
                });
            }
        };
        MapCountries.prototype.createCountries = function (countries) {
            var _this = this;
            $(countries.features)
                .each(function (key, feature) {
                _this.createMapFeature(feature);
            });
        };
        MapCountries.prototype.createMapFeature = function (feature) {
            var _this = this;
            var cc = feature.properties.iso_a2;
            var l = new L.GeoJSON(feature, {
                style: this.getCountryStyle(cc)
            });
            this.featureArray.push([cc, l]);
            l.addTo(this.map.mapObj);
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
        MapCountries.prototype.createMapboxLayer = function () {
            var tempUrl = "https://api.mapbox.com/styles/v1/gloobster/civi2b1wn00a82kpattor5wui/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
            var mapLayer = L.tileLayer(tempUrl, MapConstants.tileOptions);
            this.map.mapObj.addLayer(mapLayer);
            var topPane = this.map.mapObj.createPane('leaflet-top-pane', this.map.mapObj.getPanes().mapPane);
            topPane.appendChild(mapLayer.getContainer());
            mapLayer.setZIndex(5);
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
            $.ajax({
                dataType: "json",
                url: "/geo/custom.geo.json",
                success: function (data) {
                    _this.countriesData = data;
                    callback(data);
                }
            })
                .error(function () { alert("error voe"); });
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