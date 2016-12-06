var Planning;
(function (Planning) {
    var MapCountries = (function () {
        function MapCountries(map) {
            this.$map = $("#mapCountries");
            this.selectedCountries = [];
            this.featureArray = [];
            this.map = map;
            this.mapObj = L.map("mapCountries", Planning.MapConstants.mapOptions);
            this.position = new Planning.MapPosition(this.mapObj);
        }
        MapCountries.prototype.set = function (ccs) {
            this.selectedCountries = ccs;
            this.featureArray.forEach(function (i) {
                var cc = i[0];
                var f = i[1];
                var isSelected = _.contains(ccs, cc);
                if (isSelected) {
                    f.setStyle(Planning.MapConstants.selCountryStyle);
                }
                else {
                    f.setStyle(Planning.MapConstants.unselCountryStyle);
                }
            });
        };
        MapCountries.prototype.show = function () {
            this.$map.show();
        };
        MapCountries.prototype.hide = function () {
            this.$map.hide();
        };
        MapCountries.prototype.init = function (callback) {
            var _this = this;
            this.getGeoJson(function () {
                _this.createMapboxLayer();
                _this.createCountries();
                callback();
            });
        };
        MapCountries.prototype.createCountries = function () {
            var _this = this;
            this.ccsLayerGroup = L.layerGroup();
            this.mapObj.addLayer(this.ccsLayerGroup);
            $(this.countriesData.features)
                .each(function (key, feature) {
                _this.createMapFeature(feature);
            });
        };
        MapCountries.prototype.createMapFeature = function (feature) {
            var _this = this;
            var cc = feature.properties.cc;
            var l = new L.GeoJSON(feature, {
                style: this.getCountryStyle(cc)
            });
            this.featureArray.push([cc, l]);
            l.addTo(this.ccsLayerGroup);
            l.on("mouseover", function (e) {
                var layer = _this.getLayer(e);
                layer.setStyle(Planning.MapConstants.hoverStyle);
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
            if (!this.map.planningMap.v.hasAirs) {
                this.map.planningMap.v.showAirsFirst();
                return;
            }
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
            this.mapLayer = L.tileLayer(tempUrl, Planning.MapConstants.tileOptions);
            this.mapObj.addLayer(this.mapLayer);
            var paneName = "leaflet-top-pane";
            this.mapboxPane = this.mapObj.createPane(paneName);
            this.mapboxPane.appendChild(this.mapLayer.getContainer());
            this.mapLayer.setZIndex(5);
        };
        MapCountries.prototype.getCountryStyle = function (cc) {
            if (this.isCountrySelected(cc)) {
                return Planning.MapConstants.selCountryStyle;
            }
            else {
                return Planning.MapConstants.unselCountryStyle;
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
            var layer = this.mapObj._layers[id];
            return layer;
        };
        return MapCountries;
    }());
    Planning.MapCountries = MapCountries;
})(Planning || (Planning = {}));
//# sourceMappingURL=MapCountries.js.map