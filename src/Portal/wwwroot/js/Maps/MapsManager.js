var MapsManager = (function () {
    function MapsManager(owner) {
        var _this = this;
        this.owner = owner;
        this.mapsDataLoader = new MapsDataLoader(owner);
        this.mapsDataLoader.dataLoadedCallback = function () { _this.dataLoadedCallback(); };
        this.mapsOperations = new MapsOperations();
    }
    MapsManager.prototype.getPluginData = function (pluginType, displayEntity) {
        this.currentDisplayEntity = displayEntity;
        this.currentPluginType = pluginType;
        this.mapsDataLoader.getPluginData(pluginType, displayEntity);
    };
    MapsManager.prototype.dataLoadedCallback = function () {
        if (this.currentDisplayEntity === Maps.DisplayEntity.Pin) {
            this.redrawCities();
        }
        if (this.currentDisplayEntity === Maps.DisplayEntity.Countries) {
            this.redrawCountries();
        }
    };
    MapsManager.prototype.redrawCities = function () {
        this.mapsDriver.destroyAll();
        this.mapsOperations.drawCities(this.mapsDataLoader.viewPlaces.cities);
    };
    MapsManager.prototype.redrawCountries = function () {
        this.mapsDriver.destroyAll();
        this.mapsOperations.drawCountries(this.mapsDataLoader.viewPlaces.countries);
    };
    MapsManager.prototype.switchToView = function (viewType) {
        var _this = this;
        if (this.currentViewType === viewType) {
            return;
        }
        var savedPosition;
        var savedZoom = 1;
        if (this.mapsDriver) {
            savedPosition = this.mapsDriver.getPosition();
            savedZoom = this.mapsDriver.getZoom();
        }
        if (this.currentMaps) {
            this.currentMaps.hide();
            this.mapsDriver.destroyAll();
        }
        this.currentViewType = viewType;
        this.initView(viewType);
        this.currentMaps.show(function () {
            _this.onMapsLoaded(savedPosition, savedZoom);
        });
    };
    MapsManager.prototype.onMapsLoaded = function (savedPosition, savedZoom) {
        this.mapsOperations.setBaseMapsOperations(this.mapsDriver);
        this.mapsDriver.setMapObj(this.currentMaps.mapObj);
        this.displayData(savedPosition, savedZoom);
    };
    MapsManager.prototype.initView = function (viewType) {
        if (viewType === Maps.ViewType.D3) {
            this.init3D();
        }
        if (viewType === Maps.ViewType.D2) {
            this.init2D();
        }
    };
    MapsManager.prototype.displayData = function (savedPosition, savedZoom) {
        this.getPluginData(Maps.PluginType.MyPlacesVisited, Maps.DisplayEntity.Pin);
        if (savedPosition) {
            var roundedZoom = Math.round(savedZoom);
            console.log("savedZoom: " + roundedZoom);
            this.mapsDriver.setView(savedPosition.lat, savedPosition.lng, roundedZoom);
        }
    };
    MapsManager.prototype.init3D = function () {
        this.currentMaps = new MapsCreatorGlobe3D();
        this.currentMaps.setMapType('MQCDN1');
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