var PluginType;
(function (PluginType) {
    PluginType[PluginType["MyPlacesVisited"] = 0] = "MyPlacesVisited";
    PluginType[PluginType["MyFriendsVisited"] = 1] = "MyFriendsVisited";
    PluginType[PluginType["MyFriendsDesired"] = 2] = "MyFriendsDesired";
})(PluginType || (PluginType = {}));
var DisplayEntity;
(function (DisplayEntity) {
    DisplayEntity[DisplayEntity["Pin"] = 0] = "Pin";
    DisplayEntity[DisplayEntity["Countries"] = 1] = "Countries";
    DisplayEntity[DisplayEntity["Heat"] = 2] = "Heat";
})(DisplayEntity || (DisplayEntity = {}));
var Places = (function () {
    function Places() {
    }
    return Places;
})();
var PlacesDisplay = (function () {
    function PlacesDisplay() {
    }
    return PlacesDisplay;
})();
var MapsDataLoader = (function () {
    function MapsDataLoader(owner) {
        this.owner = owner;
    }
    MapsDataLoader.prototype.getPluginData = function (pluginType, displayEntity) {
        var _this = this;
        var request = [["pluginType", pluginType.toString()], ["displayEntity", displayEntity.toString()]];
        this.owner.apiGet("PinBoardStats", request, function (response) {
            _this.places = new Places();
            _this.viewPlaces = new PlacesDisplay();
            _this.places.places = response.VisitedPlaces;
            _this.places.cities = response.VisitedCities;
            _this.places.countries = response.VisitedCountries;
            _this.executePlugin(pluginType);
            _this.dataLoadedCallback();
        });
    };
    MapsDataLoader.prototype.executePlugin = function (pluginType) {
        if (pluginType === PluginType.MyPlacesVisited) {
            var singleColorConfig = new Maps.PolygonConfig();
            singleColorConfig.fillColor = "#009900";
            var countries = _.map(this.places.countries, function (country) {
                var countryOut = new Maps.CountryHighligt();
                countryOut.countryCode = country.CountryCode3;
                countryOut.countryConfig = singleColorConfig;
                return countryOut;
            });
            this.viewPlaces.countries = countries;
            var cities = _.map(this.places.cities, function (city) {
                var marker = new Maps.PlaceMarker(city.Location.Lat, city.Location.Lng);
                return marker;
            });
            this.viewPlaces.cities = cities;
        }
    };
    return MapsDataLoader;
})();
var MapsManager = (function () {
    //private placesInitialized = false;
    //private countriesInitialized = false;
    function MapsManager(owner) {
        var _this = this;
        this.mapLoaded = false;
        //var self = this;
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
        if (this.currentDisplayEntity === DisplayEntity.Pin) {
            this.redrawCities();
        }
        if (this.currentDisplayEntity === DisplayEntity.Countries) {
            this.redrawCountries();
        }
    };
    MapsManager.prototype.redrawCities = function () {
        //if (this.mapLoaded) {
        this.mapsDriver.destroyAll();
        this.mapsOperations.drawCities(this.mapsDataLoader.viewPlaces.cities);
        //}
    };
    MapsManager.prototype.redrawCountries = function () {
        //if (this.mapLoaded) {
        this.mapsDriver.destroyAll();
        this.mapsOperations.drawCountries(this.mapsDataLoader.viewPlaces.countries);
        //}
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
//public setVisitedCountries(countries: Maps.CountryHighligt[]) {
// this.countries = countries;
// this.redrawCountries();
// this.countriesInitialized = true;
//}
//public setVisitedPlaces(places: Maps.PlaceMarker[]) {
// this.places = places;
// this.redrawPlaces();
// this.placesInitialized = true;
//}
//private onVisitedCountriesResponse(visitedCountries) {
// this.visitedCountries = visitedCountries;
// var countryConf = this.countryConfig;
// var mappedCountries = _.map(this.visitedCountries, countryCode => {
// var country = new Maps.CountryHighligt();
// country.countryCode = countryCode;
// country.countryConfig = countryConf;
// return country;
// });
// this.setVisitedCountries(mappedCountries);
//}
//private onVisitedPlacesResponse(response) {
// this.visitedPlaces = response.Places;
// var mappedPlaces = _.map(this.visitedPlaces, place => {
// var marker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
// return marker;
// });
// this.setVisitedPlaces(mappedPlaces);
//}
//# sourceMappingURL=MapsManager.js.map