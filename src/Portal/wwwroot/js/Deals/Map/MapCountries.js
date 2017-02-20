var Planning;
(function (Planning) {
    var MapCountries = (function () {
        function MapCountries(map) {
            this.selectedCountries = [];
            this.featureArray = [];
            this.map = map;
            this.$map = $("#" + this.mapId());
            this.init();
        }
        Object.defineProperty(MapCountries.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        MapCountries.prototype.init = function () {
            this.mapObj = L.map(this.mapId(), Planning.MapConstants.mapOptions);
            this.position = new Planning.MapPosition(this.mapObj);
            this.createMapboxLayer();
            this.createCountries();
        };
        MapCountries.prototype.loadData = function () {
            var _this = this;
            var customId = this.map.planningMap.config.customId;
            var prms = [["type", this.map.planningMap.config.type.toString()], ["customId", customId]];
            this.v.apiGet("SelCountry", prms, function (ccs) {
                _this.set(ccs);
            });
        };
        MapCountries.prototype.mapId = function () {
            return "mapCountries_" + this.map.planningMap.config.catId;
        };
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
            this.$map.removeClass("hidden");
            this.loadData();
        };
        MapCountries.prototype.hide = function () {
            this.$map.addClass("hidden");
        };
        MapCountries.prototype.createCountries = function () {
            var _this = this;
            this.ccsLayerGroup = L.layerGroup();
            this.mapObj.addLayer(this.ccsLayerGroup);
            $(Planning.CountriesData.data.features)
                .each(function (key, feature) {
                _this.createMapFeature(feature);
            });
        };
        MapCountries.prototype.createMapFeature = function (feature) {
            var cc = feature.properties.cc;
            var l = new L.GeoJSON(feature, {
                style: this.getCountryStyle(cc)
            });
            this.featureArray.push([cc, l]);
            this.regEvnts(l, cc);
            l.addTo(this.ccsLayerGroup);
        };
        MapCountries.prototype.regEvnts = function (la, cc) {
            var _this = this;
            la.on("mouseover", function (e) {
                var layer = _this.getLayer(e);
                layer.setStyle(Planning.MapConstants.hoverStyle);
            });
            la.on("mouseout", function (e) {
                var layer = _this.getLayer(e);
                var s = _this.getCountryStyle(cc);
                layer.setStyle(s);
            });
            la.on("click", function (e) {
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