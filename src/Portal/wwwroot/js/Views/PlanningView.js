var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PlanningView = (function (_super) {
    __extends(PlanningView, _super);
    function PlanningView() {
        _super.call(this);
        this.initialize();
    }
    PlanningView.prototype.initialize = function () {
        this.maps = new MapsCreatorMapBox2D();
        this.maps.setRootElement("map");
        this.maps.show(function (map) {
            var mapOper = new PlanningMap(PlanningType.Anytime, map);
        });
    };
    return PlanningView;
})(Views.ViewBase);
var DelayedCallbackMap = (function () {
    function DelayedCallbackMap() {
        this.delay = 600;
        this.timeoutId = null;
    }
    DelayedCallbackMap.prototype.receiveEvent = function () {
        var _this = this;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.timeoutId = setTimeout(function () {
            _this.timeoutId = null;
            _this.callback();
        }, this.delay);
    };
    return DelayedCallbackMap;
})();
var PlanningMap = (function () {
    function PlanningMap(planningType, map) {
        this.borderColor = "#000000";
        this.fillColorUnselected = "#CFCAC8";
        this.fillColorSelected = "#57CF5F";
        this.fillColorHover = "#57CF9D";
        this.citiesLayerGroup = L.layerGroup();
        this.map = map;
        this.map.addLayer(this.citiesLayerGroup);
        this.countryShapes = new CountryShapes2();
        this.initConfigs();
        this.initCountries(planningType);
        this.initCities();
        this.cityIcon = this.getCityIcon();
        this.focusIcon = this.getCityIconFocus();
        this.selectedIcon = this.getSelectedIcon();
    }
    PlanningMap.prototype.initCities = function () {
        var _this = this;
        this.delayedZoomCallback = new DelayedCallbackMap();
        this.delayedZoomCallback.callback = function () {
            console.log("zoom finished master");
            var bounds = _this.map.getBounds();
            var zoom = _this.map.getZoom();
            var population = _this.getPopulationFromZoom(zoom);
            console.log("pop: " + population);
            var prms = [
                ["latSouth", bounds._southWest.lat],
                ["lngWest", bounds._southWest.lng],
                ["latNorth", bounds._northEast.lat],
                ["lngEast", bounds._northEast.lng],
                ["minPopulation", population],
                ["planningType", PlanningType.Anytime.toString()]
            ];
            Views.ViewBase.currentView.apiGet("airportGroup", prms, function (response) {
                _this.onCitiesResponse(response);
            });
        };
        this.map.on("zoomend", function (e) {
            _this.delayedZoomCallback.receiveEvent();
        });
        this.map.on("moveend", function (e) {
            _this.delayedZoomCallback.receiveEvent();
        });
    };
    PlanningMap.prototype.onCitiesResponse = function (cities) {
        this.createCities(cities);
        console.log("received cities: " + cities.length);
    };
    PlanningMap.prototype.createCities = function (cities) {
        var _this = this;
        var filteredCities = _.filter(cities, function (city) {
            return !_.contains(_this.selectedCountries, city.countryCode);
        });
        this.cityPairMarker = [];
        this.citiesLayerGroup.clearLayers();
        filteredCities.forEach(function (city) {
            var cityMarker = _this.createCity(city);
            _this.cityPairMarker.push({ city: city, marker: cityMarker });
        });
    };
    PlanningMap.prototype.getCitesMarkersByCountry = function (countryCode) {
        var pairs = _.filter(this.cityPairMarker, function (pair) { return pair.city.countryCode === countryCode; });
        return pairs;
    };
    PlanningMap.prototype.createCity = function (city) {
        var _this = this;
        var icon = city.selected ? this.selectedIcon : this.cityIcon;
        var marker = L.marker([city.coord.Lat, city.coord.Lng], { icon: icon });
        marker.selected = city.selected;
        marker.gid = city.gid;
        marker.on("mouseover", function (e) {
            e.target.setIcon(_this.focusIcon);
        });
        marker.on("mouseout", function (e) {
            if (!e.target.selected) {
                e.target.setIcon(_this.cityIcon);
            }
            else {
                e.target.setIcon(_this.selectedIcon);
            }
        });
        marker.on("click", function (e) {
            _this.callChangeCitySelection(PlanningType.Anytime, e.target.gid, !e.target.selected, function (res) {
                e.target.setIcon(_this.selectedIcon);
                e.target.selected = !e.target.selected;
            });
        });
        marker.addTo(this.citiesLayerGroup);
        return marker;
    };
    PlanningMap.prototype.callChangeCitySelection = function (planningType, gid, selected, callback) {
        var data = this.createRequest(PlanningType.Anytime, "cities", {
            gid: gid,
            selected: selected
        });
        Views.ViewBase.currentView.apiPut("PlanningProperty", data, function (response) {
            callback(response);
        });
    };
    PlanningMap.prototype.getCityIcon = function () {
        var icon = L.icon({
            iconUrl: '../../images/MapIcons/CityNormal.png',
            //shadowUrl: 'leaf-shadow.png',
            iconSize: [16, 16],
            //shadowSize: [50, 64], // size of the shadow
            iconAnchor: [8, 8],
        });
        return icon;
    };
    PlanningMap.prototype.getSelectedIcon = function () {
        var icon = L.icon({
            iconUrl: '../../images/MapIcons/CitySelected.png',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        return icon;
    };
    PlanningMap.prototype.getCityIconFocus = function () {
        var icon = L.icon({
            iconUrl: '../../images/MapIcons/CityFocus.png',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        return icon;
    };
    PlanningMap.prototype.getPopulationFromZoom = function (zoom) {
        if (zoom < 3) {
            return 2000000;
        }
        if (zoom === 3) {
            return 800000;
        }
        if (zoom === 4) {
            return 600000;
        }
        if (zoom === 5) {
            return 400000;
        }
        if (zoom === 6) {
            return 200000;
        }
        if (zoom === 7) {
            return 50000;
        }
        return 1;
    };
    PlanningMap.prototype.initCountries = function (planningType) {
        var _this = this;
        this.getTabData(planningType, function (data) {
            _this.viewData = data;
            _this.createCountries(_this.viewData.countryCodes);
        });
    };
    PlanningMap.prototype.initConfigs = function () {
        var sc = new PolygonConfig();
        sc.fillColor = this.fillColorSelected;
        sc.borderColor = this.borderColor;
        this.selectedConfig = sc;
        var uc = new PolygonConfig();
        uc.fillColor = this.fillColorUnselected;
        uc.borderColor = this.borderColor;
        this.unselectedConfig = uc;
    };
    PlanningMap.prototype.createCountries = function (selectedCountries) {
        var _this = this;
        this.selectedCountries = selectedCountries;
        this.countryShapes.countriesList.forEach(function (country) {
            var selected = _.contains(selectedCountries, country.name);
            var config = selected ? _this.selectedConfig : _this.unselectedConfig;
            _this.drawCountry(country, config);
        });
    };
    PlanningMap.prototype.drawCountry = function (country, polygonConfig) {
        var _this = this;
        var polygon = L.polygon(country.coordinates, {
            color: polygonConfig.borderColor,
            opacity: polygonConfig.borderOpacity,
            weight: polygonConfig.borderWeight,
            fillColor: polygonConfig.fillColor,
            fillOpacity: polygonConfig.fillOpacity
        }).addTo(this.map);
        polygon.countryCode = country.name;
        polygon.on("click", function (e) {
            var countryCode = e.target.countryCode;
            var wasSelected = _.contains(_this.selectedCountries, countryCode);
            var newFillColor = wasSelected ? _this.fillColorUnselected : _this.fillColorSelected;
            _this.callChangeCountrySelection(PlanningType.Anytime, countryCode, !wasSelected, function (response) {
                e.target.setStyle({ fillColor: newFillColor });
                if (wasSelected) {
                    _this.selectedCountries = _.reject(_this.selectedCountries, function (cntry) { return cntry === countryCode; });
                    _this.showCityMarkersByCountry(countryCode);
                }
                else {
                    _this.selectedCountries.push(countryCode);
                    _this.hideCityMarkersByCountry(countryCode);
                }
            });
        });
        polygon.on("mouseover", function (e) {
            e.target.setStyle({ fillColor: _this.fillColorHover });
        });
        polygon.on("mouseout", function (e) {
            var countryCode = e.target.countryCode;
            var selected = _.contains(_this.selectedCountries, countryCode);
            var fillColor = selected ? _this.fillColorSelected : _this.fillColorUnselected;
            e.target.setStyle({ fillColor: fillColor });
        });
    };
    PlanningMap.prototype.hideCityMarkersByCountry = function (countryCode) {
        var _this = this;
        var cityMarkerPairs = this.getCitesMarkersByCountry(countryCode);
        cityMarkerPairs.forEach(function (pair) {
            _this.citiesLayerGroup.removeLayer(pair.marker);
            pair.marker = null;
        });
    };
    PlanningMap.prototype.showCityMarkersByCountry = function (countryCode) {
        var _this = this;
        var cityMarkerPairs = this.getCitesMarkersByCountry(countryCode);
        cityMarkerPairs.forEach(function (pair) {
            var cityMarker = _this.createCity(pair.city);
            pair.marker = cityMarker;
        });
    };
    PlanningMap.prototype.getTabData = function (planningType, callback) {
        var prms = [["planningType", planningType.toString()]];
        Views.ViewBase.currentView.apiGet("PlanningProperty", prms, function (response) {
            callback(response);
        });
    };
    PlanningMap.prototype.callChangeCountrySelection = function (planningType, countryCode, selected, callback) {
        var data = this.createRequest(PlanningType.Anytime, "countries", {
            countryCode: countryCode,
            selected: selected
        });
        Views.ViewBase.currentView.apiPut("PlanningProperty", data, function (response) {
            callback(response);
        });
    };
    PlanningMap.prototype.createRequest = function (planningType, propertyName, values) {
        var request = { planningType: planningType, propertyName: propertyName, values: values };
        return request;
    };
    return PlanningMap;
})();
var PlanningType;
(function (PlanningType) {
    PlanningType[PlanningType["Anytime"] = 0] = "Anytime";
    PlanningType[PlanningType["Weekend"] = 1] = "Weekend";
    PlanningType[PlanningType["Custom"] = 2] = "Custom";
})(PlanningType || (PlanningType = {}));
var PolygonConfig = (function () {
    function PolygonConfig() {
        var defaultColor = '#2F81DE';
        this.borderColor = defaultColor;
        this.borderOpacity = 1;
        this.borderWeight = 1;
        this.fillColor = defaultColor;
        this.fillOpacity = 0.5;
    }
    return PolygonConfig;
})();
var PlanningBaseMapsOperations = (function () {
    function PlanningBaseMapsOperations() {
        this.polygons = [];
        this.markers = [];
    }
    return PlanningBaseMapsOperations;
})();
var PlanningMapsOperations = (function () {
    function PlanningMapsOperations() {
    }
    return PlanningMapsOperations;
})();
//# sourceMappingURL=PlanningView.js.map