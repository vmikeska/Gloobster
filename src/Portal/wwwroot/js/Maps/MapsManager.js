var MapsManager = (function () {
    function MapsManager(owner) {
        this.mapLoaded = false;
        this.placesInitialized = false;
        this.countriesInitialized = false;
        this.owner = owner;
        this.getVisitedCountries();
        this.getVisitedPlaces();
        var countryShapes = new CountryShapes();
        this.mapsOperations = new MapsOperations(countryShapes);
    }
    Object.defineProperty(MapsManager.prototype, "countryConfig", {
        get: function () {
            var countryConfig = new Maps.PolygonConfig();
            countryConfig.fillColor = "#009900";
            return countryConfig;
        },
        enumerable: true,
        configurable: true
    });
    MapsManager.prototype.redrawAll = function () {
        this.redrawCountries();
        this.redrawPlaces();
    };
    MapsManager.prototype.redrawPlaces = function () {
        if (this.mapLoaded && this.placesInitialized) {
            this.mapsOperations.drawPlaces(this.places);
        }
    };
    MapsManager.prototype.redrawCountries = function () {
        if (this.mapLoaded && this.countriesInitialized) {
            this.mapsOperations.drawCountries(this.countries);
        }
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
        var _this = this;
        if (this.currentViewType === viewType) {
            return;
        }
        var savedPosition;
        var savedZoom = 1;
        this.mapLoaded = false;
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
        this.mapLoaded = true;
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
        this.redrawAll();
        if (savedPosition) {
            var roundedZoom = Math.round(savedZoom);
            console.log("savedZoom: " + roundedZoom);
            this.mapsDriver.setView(savedPosition.lat, savedPosition.lng, roundedZoom);
        }
    };
    MapsManager.prototype.getVisitedPlaces = function () {
        var _this = this;
        this.owner.apiGet("visitedPlace", null, function (response) {
            _this.onVisitedPlacesResponse(response);
        });
    };
    MapsManager.prototype.getVisitedCountries = function () {
        var _this = this;
        this.owner.apiGet("visitedCountry", null, function (response) {
            _this.onVisitedCountriesResponse(response.Countries3);
        });
    };
    MapsManager.prototype.onVisitedCountriesResponse = function (visitedCountries) {
        this.visitedCountries = visitedCountries;
        var countryConf = this.countryConfig;
        var mappedCountries = _.map(this.visitedCountries, function (countryCode) {
            var country = new Maps.CountryHighligt();
            country.countryCode = countryCode;
            country.countryConfig = countryConf;
            return country;
        });
        this.setVisitedCountries(mappedCountries);
    };
    MapsManager.prototype.onVisitedPlacesResponse = function (response) {
        this.visitedPlaces = response.Places;
        var mappedPlaces = _.map(this.visitedPlaces, function (place) {
            var marker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
            return marker;
        });
        this.setVisitedPlaces(mappedPlaces);
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