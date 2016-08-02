var Maps;
(function (Maps) {
    var MapsCreatorGlobe3D = (function () {
        function MapsCreatorGlobe3D() {
        }
        MapsCreatorGlobe3D.prototype.setRootElement = function (rootElement) {
            this.rootElement = rootElement;
        };
        MapsCreatorGlobe3D.prototype.show = function (mapsLoadedCallback) {
            var _this = this;
            this.showPreloader(true);
            this.loadScript("/lib/webglearth-api.js", function () {
                _this.showPreloader(false);
                var mapOptions = {};
                var layerOptions = {};
                var mapUrl = 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ';
                _this.mapObj = new WE.map(_this.rootElement, mapOptions);
                WE.tileLayer(mapUrl, layerOptions).addTo(_this.mapObj);
                mapsLoadedCallback();
            });
        };
        MapsCreatorGlobe3D.prototype.showPreloader = function (visible) {
            if (visible) {
                $("#map").append("<div class=\"preloader-cont\"><img src=\"/images/Preloader_1.gif\" /></div>");
            }
            else {
                $(".preloader-cont").remove();
            }
        };
        MapsCreatorGlobe3D.prototype.loadScript = function (scriptUrl, callback) {
            $.getScript(scriptUrl, function (data, textStatus, jqxhr) {
                callback();
            });
        };
        MapsCreatorGlobe3D.prototype.hide = function () {
            $("#" + this.rootElement).empty();
        };
        return MapsCreatorGlobe3D;
    }());
    Maps.MapsCreatorGlobe3D = MapsCreatorGlobe3D;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsCreatorGlobe3D.js.map