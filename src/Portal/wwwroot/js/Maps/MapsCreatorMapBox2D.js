var Maps;
(function (Maps) {
    var MapsCreatorMapBox2D = (function () {
        function MapsCreatorMapBox2D() {
            this.options = {
                tileLayer: {
                    continuousWorld: false,
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
        MapsCreatorMapBox2D.prototype.show = function (mapsLoadedCallback) {
            var self = this;
            self.loadMap();
            mapsLoadedCallback(this.mapObj);
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
                callback();
            });
        };
        MapsCreatorMapBox2D.prototype.hide = function () {
            this.mapObj.remove();
        };
        return MapsCreatorMapBox2D;
    }());
    Maps.MapsCreatorMapBox2D = MapsCreatorMapBox2D;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsCreatorMapBox2D.js.map