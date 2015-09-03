var MapsManager = (function () {
    function MapsManager() {
        this.countryShapes = new CountryShapes();
    }
    MapsManager.prototype.redraw = function () {
        this.mapsOperations.drawCountries(this.countries);
    };
    MapsManager.prototype.switchToView = function (viewType) {
        if (this.currentMaps) {
            this.currentMaps.hide();
        }
        this.currentViewType = viewType;
        if (viewType === Maps.ViewType.D3) {
            this.init3D();
        }
        this.currentMaps.show();
    };
    MapsManager.prototype.init3D = function () {
        this.currentMaps = new MapsCreatorGlobe3D();
        this.currentMaps.setMapType('MQCDN1');
        this.currentMaps.setRootElement('earth_div');
        this.mapsBaseOperations = new MapsBaseOperation3D(this.currentMaps.mapObj);
        this.mapsOperations = new MapsOperations3D(this.mapsBaseOperations, this.countryShapes);
    };
    return MapsManager;
})();
//# sourceMappingURL=MapsManager.js.map