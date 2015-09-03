//enum MapTypes { OSM, MQCDN, MQCDN1 };
var Maps;
(function (Maps) {
    (function (ViewType) {
        ViewType[ViewType["D3"] = 0] = "D3";
        ViewType[ViewType["D2"] = 1] = "D2";
        ViewType[ViewType["D1"] = 2] = "D1";
    })(Maps.ViewType || (Maps.ViewType = {}));
    var ViewType = Maps.ViewType;
})(Maps || (Maps = {}));
var MapsCreatorGlobe3D = (function () {
    function MapsCreatorGlobe3D() {
    }
    MapsCreatorGlobe3D.prototype.setRootElement = function (rootElement) {
        this.rootElement = rootElement;
    };
    MapsCreatorGlobe3D.prototype.setMapType = function (mapType) {
        this.mapType = mapType;
    };
    MapsCreatorGlobe3D.prototype.show = function () {
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
                attribution: 'Tiles Courtesy of MapQuest'
            };
        }
        if (this.mapType === 'MQCDN1') {
            mapUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
            layerOptions = {
                attribution: 'Tiles Courtesy of MapQuest'
            };
        }
        this.mapObj = new WE.map(this.rootElement, mapOptions);
        WE.tileLayer(mapUrl, layerOptions).addTo(this.mapObj);
    };
    MapsCreatorGlobe3D.prototype.hide = function () { };
    return MapsCreatorGlobe3D;
})();
;
//class MapsCreator {
//		public earthDiv: string;
//		public earth: any;
//		constructor(earthDiv) {
//				this.earthDiv = earthDiv;
//		}
//    public initializeGlobe(mapType: MapTypes) {
//        var mapOptions = {};
//        var layerOptions = {};
//        var mapUrl = '';
//        if (mapType === MapTypes.OSM) {
//            mapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
//        }
//        if (mapType === MapTypes.MQCDN) {
//            mapUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg';
//            mapOptions = { atmosphere: true, center: [0, 0], zoom: 0 };
//            layerOptions = {
//                subdomains: '1234',
//                attribution: 'Tiles Courtesy of MapQuest'
//            };
//        }
//        if (mapType === MapTypes.MQCDN1) {
//            mapUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
//            layerOptions = {
//                attribution: 'Tiles Courtesy of MapQuest'
//            }
//        }
//        this.earth = new WE.map(this.earthDiv, mapOptions);
//        WE.tileLayer(mapUrl, layerOptions).addTo(this.earth);
//    }
//}; 
//# sourceMappingURL=MapsCreator.js.map