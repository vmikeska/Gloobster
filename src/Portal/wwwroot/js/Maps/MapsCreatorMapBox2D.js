var Maps;
(function (Maps) {
    var MapsCreatorMapBox2D = (function () {
        function MapsCreatorMapBox2D() {
            this.options = {
                tileLayer: {
                    // This map option disables world wrapping. by default, it is false.
                    continuousWorld: false,
                    // This option disables loading tiles outside of the world bounds.
                    noWrap: true
                },
                maxBounds: null,
                maxZoom: 19,
                minZoom: 2
            };
        }
        MapsCreatorMapBox2D.prototype.setRootElement = function (rootElement) {
            this.rootElement = rootElement;
        };
        MapsCreatorMapBox2D.prototype.setMapType = function (mapType) {
            this.mapType = mapType;
        };
        MapsCreatorMapBox2D.prototype.show = function (mapsLoadedCallback) {
            var _this = this;
            var self = this;
            this.loadScript("http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js", function () {
                self.loadScript("https://api.mapbox.com/mapbox.js/v2.2.2/mapbox.js", function () {
                    self.loadScript("https://api.mapbox.com/mapbox.js/plugins/leaflet-heat/v0.1.3/leaflet-heat.js", function () {
                        self.loadMap();
                        mapsLoadedCallback(_this.mapObj);
                    });
                });
            });
        };
        MapsCreatorMapBox2D.prototype.loadMap = function () {
            var _this = this;
            L.mapbox.accessToken = "pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
            this.options.maxBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));
            this.mapObj = L.mapbox.map(this.rootElement, 'gloobster.afeef633', this.options);
            this.mapObj.on("move", function (e) {
                if (_this.onCenterChanged) {
                    var c = _this.mapObj.getCenter();
                    _this.onCenterChanged(c);
                }
            });
        };
        MapsCreatorMapBox2D.prototype.loadScript = function (scriptUrl, callback) {
            $.getScript(scriptUrl, function (data, textStatus, jqxhr) {
                console.log("Loaded: " + scriptUrl);
                callback();
            });
        };
        MapsCreatorMapBox2D.prototype.hide = function () {
            this.mapObj.remove();
        };
        return MapsCreatorMapBox2D;
    })();
    Maps.MapsCreatorMapBox2D = MapsCreatorMapBox2D;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsCreatorMapBox2D.js.map