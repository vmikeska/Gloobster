var Maps;
(function (Maps) {
    var MapsCreatorGlobe3D = (function () {
        function MapsCreatorGlobe3D() {
        }
        MapsCreatorGlobe3D.prototype.setRootElement = function (rootElement) {
            this.rootElement = rootElement;
        };
        MapsCreatorGlobe3D.prototype.setMapType = function (mapType) {
            this.mapType = mapType;
        };
        MapsCreatorGlobe3D.prototype.show = function (mapsLoadedCallback) {
            var mapOptions = {};
            var layerOptions = {};
            var mapUrl = '';
            if (this.mapType === 'OSM') {
                mapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            }
            if (this.mapType === 'MQCDN') {
                mapUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg';
                mapOptions = { atmosphere: true, center: [0, 0], zoom: 0 };
                layerOptions = {
                    subdomains: '1234',
                    attribution: 'Tiles Courtesy of MapQuest & webglearth.org'
                };
            }
            if (this.mapType === 'MQCDN1') {
                mapUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
                layerOptions = {
                    attribution: 'Tiles Courtesy of MapQuest & webglearth.org'
                };
            }
            this.mapObj = new WE.map(this.rootElement, mapOptions);
            WE.tileLayer(mapUrl, layerOptions).addTo(this.mapObj);
            //doesn't work
            //this.mapObj.on("move", (e) => {
            //	console.log("from 3d");
            //});
            mapsLoadedCallback();
        };
        MapsCreatorGlobe3D.prototype.hide = function () {
            $("#" + this.rootElement).empty();
        };
        return MapsCreatorGlobe3D;
    })();
    Maps.MapsCreatorGlobe3D = MapsCreatorGlobe3D;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsCreatorGlobe3D.js.map