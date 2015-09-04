var MapsManager = (function () {
    function MapsManager() {
        this.countryShapes = new CountryShapes();
    }
    MapsManager.prototype.redrawAll = function () {
        this.redrawCountries();
        this.redrawPlaces();
    };
    MapsManager.prototype.redrawPlaces = function () {
        this.mapsOperations.drawPlaces(this.places);
    };
    MapsManager.prototype.redrawCountries = function () {
        this.mapsOperations.drawCountries(this.countries);
    };
    MapsManager.prototype.setVisitedCountries = function (countries) {
        this.countries = countries;
        this.redrawCountries();
    };
    MapsManager.prototype.setVisitedPlaces = function (places) {
        this.places = places;
        this.redrawPlaces();
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
        this.mapsBaseOperations.setMapObj(this.currentMaps.mapObj);
    };
    MapsManager.prototype.init3D = function () {
        this.currentMaps = new MapsCreatorGlobe3D();
        this.currentMaps.setMapType('MQCDN1');
        this.currentMaps.setRootElement('earth_div');
        this.mapsBaseOperations = new BaseMapsOperation3D();
        this.mapsOperations = new MapsOperations3D(this.mapsBaseOperations, this.countryShapes);
    };
    return MapsManager;
})();
//# sourceMappingURL=MapsManager.js.map