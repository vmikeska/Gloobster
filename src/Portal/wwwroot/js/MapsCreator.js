var MapTypes;
(function (MapTypes) {
    MapTypes[MapTypes["OSM"] = 0] = "OSM";
    MapTypes[MapTypes["MQCDN"] = 1] = "MQCDN";
    MapTypes[MapTypes["MQCDN1"] = 2] = "MQCDN1";
})(MapTypes || (MapTypes = {}));
;
var MapsCreator = (function () {
    function MapsCreator(earthDiv) {
        this.earthDiv = earthDiv;
    }
    MapsCreator.prototype.initializeGlobe = function (mapType) {
        var mapOptions = {};
        var layerOptions = {};
        var mapUrl = '';
        if (mapType === MapTypes.OSM) {
            mapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }
        if (mapType === MapTypes.MQCDN) {
            mapUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg';
            mapOptions = { atmosphere: true, center: [0, 0], zoom: 0 };
            layerOptions = {
                subdomains: '1234',
                attribution: 'Tiles Courtesy of MapQuest'
            };
        }
        if (mapType === MapTypes.MQCDN1) {
            mapUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
            layerOptions = {
                attribution: 'Tiles Courtesy of MapQuest'
            };
        }
        this.earth = new WE.map(this.earthDiv, mapOptions);
        WE.tileLayer(mapUrl, layerOptions).addTo(this.earth);
    };
    return MapsCreator;
})();
;
//# sourceMappingURL=MapsCreator.js.map