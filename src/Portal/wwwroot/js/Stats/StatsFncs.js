var Stats;
(function (Stats) {
    var InstanceLoader = (function () {
        function InstanceLoader() {
        }
        InstanceLoader.getInstance = function (context, name) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var instance = Object.create(context[name].prototype);
            instance.constructor.apply(instance, args);
            return instance;
        };
        return InstanceLoader;
    }());
    Stats.InstanceLoader = InstanceLoader;
    var CountriesPlugin = (function () {
        function CountriesPlugin(mapObj) {
            this.mapObj = mapObj;
            this.createCountries();
            this.drawLegend();
            this.createMapboxLayer();
            this.customExe();
        }
        CountriesPlugin.prototype.drawLegend = function () {
            var lg = Common.ListGenerator.init($(".legend-cont"), "legend-item-template");
            lg.onItemAppended = function ($item, item) {
                $item.find(".color").css("background-color", item.color);
            };
            lg.generateList(this.legendItems);
        };
        CountriesPlugin.prototype.createCountries = function () {
            var _this = this;
            this.ccsLayerGroup = L.layerGroup();
            this.mapObj.addLayer(this.ccsLayerGroup);
            $(Planning.CountriesData.data.features)
                .each(function (key, feature) {
                _this.createMapFeature(feature);
            });
        };
        CountriesPlugin.prototype.customExe = function () {
        };
        Object.defineProperty(CountriesPlugin.prototype, "legendItems", {
            get: function () { return []; },
            enumerable: true,
            configurable: true
        });
        CountriesPlugin.prototype.createMapFeature = function (feature) {
            var cc = feature.properties.cc;
            var l = new L.GeoJSON(feature, {
                style: this.getCountryStyle(cc)
            });
            l.addTo(this.ccsLayerGroup);
        };
        CountriesPlugin.prototype.getCountryStyle = function (color) {
            return null;
        };
        CountriesPlugin.prototype.createMapboxLayer = function () {
            var tempUrl = "https://api.mapbox.com/styles/v1/gloobster/civi2b1wn00a82kpattor5wui/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
            this.mapLayer = L.tileLayer(tempUrl, { noWrap: true });
            this.mapObj.addLayer(this.mapLayer);
            var paneName = "leaflet-top-pane";
            this.mapboxPane = this.mapObj.createPane(paneName);
            this.mapboxPane.appendChild(this.mapLayer.getContainer());
            this.mapLayer.setZIndex(5);
        };
        return CountriesPlugin;
    }());
    Stats.CountriesPlugin = CountriesPlugin;
})(Stats || (Stats = {}));
//# sourceMappingURL=StatsFncs.js.map