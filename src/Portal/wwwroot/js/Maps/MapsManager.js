var MapsManager = (function () {
    function MapsManager() {
        this.placesInitialized = false;
        this.countriesInitialized = false;
        var countryShapes = new CountryShapes();
        this.mapsOperations = new MapsOperations(countryShapes);
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
        this.countriesInitialized = true;
    };
    MapsManager.prototype.setVisitedPlaces = function (places) {
        this.places = places;
        this.redrawPlaces();
        this.placesInitialized = true;
    };
    MapsManager.prototype.switchToView = function (viewType) {
        if (this.currentMaps) {
            this.currentMaps.hide();
            this.mapsDriver.destroyAll();
        }
        this.currentViewType = viewType;
        if (viewType === Maps.ViewType.D3) {
            this.init3D();
        }
        if (viewType === Maps.ViewType.D2) {
            this.init2D();
        }
        this.currentMaps.show();
        this.mapsDriver.setMapObj(this.currentMaps.mapObj);
        this.mapsOperations.setBaseMapsOperations(this.mapsDriver);
        if (this.placesInitialized) {
            this.redrawPlaces();
        }
        if (this.countriesInitialized) {
            this.redrawCountries();
        }
    };
    MapsManager.prototype.init3D = function () {
        this.currentMaps = new MapsCreatorGlobe3D();
        this.currentMaps.setMapType('MQCDN1');
        //this.currentMaps.setRootElement('earth_div');
        this.currentMaps.setRootElement('map');
        this.mapsDriver = new BaseMapsOperation3D();
    };
    MapsManager.prototype.init2D = function () {
        this.currentMaps = new MapsCreatorMapBox2D();
        this.currentMaps.setRootElement('map');
        this.mapsDriver = new BaseMapsOperation2D();
    };
    return MapsManager;
})();
//# sourceMappingURL=MapsManager.js.map