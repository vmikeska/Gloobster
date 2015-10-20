var MapsCreatorMapBox2D = (function () {
    function MapsCreatorMapBox2D() {
    }
    MapsCreatorMapBox2D.prototype.setRootElement = function (rootElement) {
        this.rootElement = rootElement;
    };
    MapsCreatorMapBox2D.prototype.setMapType = function (mapType) {
        this.mapType = mapType;
    };
    MapsCreatorMapBox2D.prototype.show = function (mapsLoadedCallback) {
        var self = this;
        this.loadScript("http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js", function () {
            self.loadScript("https://api.mapbox.com/mapbox.js/v2.2.2/mapbox.js", function () {
                self.loadScript("https://api.mapbox.com/mapbox.js/plugins/leaflet-heat/v0.1.3/leaflet-heat.js", function () {
                    self.loadMap();
                    mapsLoadedCallback();
                });
            });
        });
    };
    MapsCreatorMapBox2D.prototype.loadMap = function () {
        L.mapbox.accessToken = 'pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ';
        this.mapObj = L.mapbox.map(this.rootElement, 'gloobster.afeef633');
    };
    MapsCreatorMapBox2D.prototype.loadScript = function (scriptUrl, callback) {
        $.getScript(scriptUrl, function (data, textStatus, jqxhr) {
            console.log("Loaded: " + scriptUrl);
            callback();
        });
    };
    MapsCreatorMapBox2D.prototype.hide = function () {
        //$("#" + this.rootElement).empty();
        this.mapObj.remove();
    };
    return MapsCreatorMapBox2D;
})();
;
//# sourceMappingURL=MapsCreatorMapBox2D.js.map