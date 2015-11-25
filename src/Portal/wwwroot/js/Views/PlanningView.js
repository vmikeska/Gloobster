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
        this.registerTabEvents();
    }
    PlanningView.prototype.initialize = function () {
        var _this = this;
        this.maps = new MapsCreatorMapBox2D();
        this.maps.setRootElement("map");
        this.maps.show(function (map) {
            _this.mapsOperations = new PlanningMap(map);
            _this.mapsOperations.loadCategory(PlanningType.Anytime);
        });
    };
    PlanningView.prototype.registerTabEvents = function () {
        var _this = this;
        this.anytimeTabTemplate = Views.ViewBase.currentView.registerTemplate("anytime-template");
        this.weekendTabTemplate = Views.ViewBase.currentView.registerTemplate("weekend-template");
        this.customTabTemplate = Views.ViewBase.currentView.registerTemplate("custom-template");
        var $tabsRoot = $(".tabs");
        var $tabs = $tabsRoot.find(".tab");
        $tabs.click(function (e) { _this.switchTab($(e.delegateTarget), $tabs); });
    };
    PlanningView.prototype.switchTab = function ($target, $tabs) {
        $tabs.removeClass("active");
        $target.addClass("active");
        var tabType = parseInt($target.data("type"));
        var tabHtml = "";
        if (tabType === PlanningType.Anytime) {
            tabHtml = this.anytimeTabTemplate();
        }
        if (tabType === PlanningType.Weekend) {
            tabHtml = this.weekendTabTemplate();
        }
        if (tabType === PlanningType.Custom) {
            tabHtml = this.customTabTemplate();
        }
        var $tabContent = $("#tabContent");
        $tabContent.html(tabHtml);
        this.onTabSwitched(tabType);
    };
    PlanningView.prototype.onTabSwitched = function (tabType) {
        this.mapsOperations.loadCategory(tabType);
    };
    return PlanningView;
})(Views.ViewBase);
var WeekendForm = (function () {
    function WeekendForm(data) {
        var _this = this;
        this.$plus1 = $("#plus1");
        this.$plus2 = $("#plus2");
        this.setDaysCheckboxes(data.extraDaysLength);
        this.$plus1.click(function (e) {
            var checked = _this.$plus1.prop("checked");
            if (checked) {
                _this.extraDaysClicked(1);
            }
            else {
                _this.extraDaysClicked(0);
            }
        });
        this.$plus2.click(function (e) {
            var checked = _this.$plus2.prop("checked");
            if (checked) {
                _this.extraDaysClicked(2);
            }
            else {
                _this.extraDaysClicked(1);
            }
        });
    }
    WeekendForm.prototype.setDaysCheckboxes = function (length) {
        if (length === 0) {
            this.$plus1.prop("checked", false);
            this.$plus2.prop("checked", false);
        }
        if (length === 1) {
            this.$plus1.prop("checked", true);
            this.$plus2.prop("checked", false);
        }
        if (length === 2) {
            this.$plus1.prop("checked", true);
            this.$plus2.prop("checked", true);
        }
    };
    WeekendForm.prototype.extraDaysClicked = function (length) {
        var _this = this;
        var data = PlanningSender.createRequest(PlanningType.Weekend, "ExtraDaysLength", { length: length });
        PlanningSender.updateProp(data, function (response) {
            _this.setDaysCheckboxes(length);
        });
    };
    return WeekendForm;
})();
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
var GraphicConfig = (function () {
    function GraphicConfig() {
        this.borderColor = "#000000";
        this.fillColorUnselected = "#CFCAC8";
        this.fillColorSelected = "#57CF5F";
        this.fillColorHover = "#57CF9D";
        this.cityIcon = this.getCityIcon();
        this.focusIcon = this.getCityIconFocus();
        this.selectedIcon = this.getSelectedIcon();
        this.initConfigs();
    }
    GraphicConfig.prototype.getCityIcon = function () {
        var icon = L.icon({
            iconUrl: '../../images/MapIcons/CityNormal.png',
            //shadowUrl: 'leaf-shadow.png',
            iconSize: [16, 16],
            //shadowSize: [50, 64], // size of the shadow
            iconAnchor: [8, 8],
        });
        return icon;
    };
    GraphicConfig.prototype.getSelectedIcon = function () {
        var icon = L.icon({
            iconUrl: '../../images/MapIcons/CitySelected.png',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        return icon;
    };
    GraphicConfig.prototype.getCityIconFocus = function () {
        var icon = L.icon({
            iconUrl: '../../images/MapIcons/CityFocus.png',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        return icon;
    };
    GraphicConfig.prototype.initConfigs = function () {
        var sc = new PolygonConfig();
        sc.fillColor = this.fillColorSelected;
        sc.borderColor = this.borderColor;
        this.selectedConfig = sc;
        var uc = new PolygonConfig();
        uc.fillColor = this.fillColorUnselected;
        uc.borderColor = this.borderColor;
        this.unselectedConfig = uc;
    };
    return GraphicConfig;
})();
var PolygonConfig = (function () {
    function PolygonConfig() {
        var defaultColor = '#2F81DE';
        this.borderColor = defaultColor;
        this.borderOpacity = 1;
        this.borderWeight = 1;
        this.fillColor = defaultColor;
        this.fillOpacity = 0.5;
    }
    PolygonConfig.prototype.convert = function () {
        return {
            color: this.borderColor,
            opacity: this.borderOpacity,
            weight: this.borderWeight,
            fillColor: this.fillColor,
            fillOpacity: this.fillOpacity
        };
    };
    return PolygonConfig;
})();
var PlanningMap = (function () {
    function PlanningMap(map) {
        this.map = map;
        this.graph = new GraphicConfig();
        this.citiesManager = new CitiesManager(map, this.graph);
        this.countriesManager = new CountriesManager(map, this.graph);
        this.citiesManager.countriesManager = this.countriesManager;
        this.countriesManager.citiesManager = this.citiesManager;
    }
    PlanningMap.prototype.loadCategory = function (planningType) {
        this.currentPlanningType = planningType;
        this.initCategory();
        this.loadCitiesInRange();
        this.delayedZoomCallback.receiveEvent();
    };
    PlanningMap.prototype.loadCitiesInRange = function () {
        var _this = this;
        this.delayedZoomCallback = new DelayedCallbackMap();
        this.delayedZoomCallback.callback = function () {
            _this.callToLoadCities();
        };
        this.map.on("zoomend", function (e) {
            _this.delayedZoomCallback.receiveEvent();
        });
        this.map.on("moveend", function (e) {
            _this.delayedZoomCallback.receiveEvent();
        });
    };
    PlanningMap.prototype.callToLoadCities = function () {
        var _this = this;
        var bounds = this.map.getBounds();
        var zoom = this.map.getZoom();
        var population = this.getPopulationFromZoom(zoom);
        var prms = [
            ["latSouth", bounds._southWest.lat],
            ["lngWest", bounds._southWest.lng],
            ["latNorth", bounds._northEast.lat],
            ["lngEast", bounds._northEast.lng],
            ["minPopulation", population],
            ["planningType", this.currentPlanningType.toString()]
        ];
        Views.ViewBase.currentView.apiGet("airportGroup", prms, function (response) {
            _this.onCitiesResponse(response);
        });
    };
    PlanningMap.prototype.initCategory = function () {
        var _this = this;
        this.getTabData(this.currentPlanningType, function (data) {
            _this.viewData = data;
            if (_this.currentPlanningType === PlanningType.Anytime) {
                _this.countriesManager.createCountries(_this.viewData.countryCodes, _this.currentPlanningType);
            }
            if (_this.currentPlanningType === PlanningType.Weekend) {
                _this.countriesManager.createCountries(_this.viewData.countryCodes, _this.currentPlanningType);
                _this.weekendForm = new WeekendForm(data);
            }
        });
    };
    PlanningMap.prototype.getTabData = function (planningType, callback) {
        var prms = [["planningType", planningType.toString()]];
        Views.ViewBase.currentView.apiGet("PlanningProperty", prms, function (response) {
            callback(response);
        });
    };
    PlanningMap.prototype.onCitiesResponse = function (cities) {
        this.citiesManager.createCities(cities, this.currentPlanningType);
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
    return PlanningMap;
})();
var CountriesManager = (function () {
    function CountriesManager(map, graph) {
        this.selectedCountries = [];
        this.graph = graph;
        this.map = map;
        this.countriesLayerGroup = L.layerGroup();
        this.map.addLayer(this.countriesLayerGroup);
        this.countryShapes = new CountryShapes2();
    }
    CountriesManager.prototype.createCountries = function (selectedCountries, planningType) {
        var _this = this;
        this.currentPlanningType = planningType;
        this.countriesLayerGroup.clearLayers();
        this.selectedCountries = selectedCountries;
        this.countryShapes.countriesList.forEach(function (country) {
            var selected = _.contains(selectedCountries, country.name);
            var config = selected ? _this.graph.selectedConfig : _this.graph.unselectedConfig;
            _this.createCountry(country, config);
        });
    };
    CountriesManager.prototype.createCountry = function (country, polygonConfig) {
        var _this = this;
        var polygon = L.polygon(country.coordinates, polygonConfig.convert());
        polygon.addTo(this.countriesLayerGroup);
        polygon.countryCode = country.name;
        polygon.on("click", function (e) {
            var countryCode = e.target.countryCode;
            var wasSelected = _.contains(_this.selectedCountries, countryCode);
            var newFillColor = wasSelected ? _this.graph.fillColorUnselected : _this.graph.fillColorSelected;
            _this.callChangeCountrySelection(_this.currentPlanningType, countryCode, !wasSelected, function (response) {
                e.target.setStyle({ fillColor: newFillColor });
                if (wasSelected) {
                    _this.selectedCountries = _.reject(_this.selectedCountries, function (cntry) { return cntry === countryCode; });
                    _this.citiesManager.showCityMarkersByCountry(countryCode);
                }
                else {
                    _this.selectedCountries.push(countryCode);
                    _this.citiesManager.hideCityMarkersByCountry(countryCode);
                }
            });
        });
        polygon.on("mouseover", function (e) {
            e.target.setStyle({ fillColor: _this.graph.fillColorHover });
        });
        polygon.on("mouseout", function (e) {
            var countryCode = e.target.countryCode;
            var selected = _.contains(_this.selectedCountries, countryCode);
            var fillColor = selected ? _this.graph.fillColorSelected : _this.graph.fillColorUnselected;
            e.target.setStyle({ fillColor: fillColor });
        });
    };
    CountriesManager.prototype.callChangeCountrySelection = function (planningType, countryCode, selected, callback) {
        var data = PlanningSender.createRequest(planningType, "countries", {
            countryCode: countryCode,
            selected: selected
        });
        PlanningSender.updateProp(data, function (response) {
            callback(response);
        });
    };
    return CountriesManager;
})();
var PlanningSender = (function () {
    function PlanningSender() {
    }
    PlanningSender.updateProp = function (data, callback) {
        Views.ViewBase.currentView.apiPut("PlanningProperty", data, function (response) {
            callback(response);
        });
    };
    PlanningSender.createRequest = function (planningType, propertyName, values) {
        var request = { planningType: planningType, propertyName: propertyName, values: values };
        return request;
    };
    return PlanningSender;
})();
var CitiesManager = (function () {
    function CitiesManager(map, graph) {
        this.cities = [];
        this.citiesToMarkers = [];
        this.graph = graph;
        this.map = map;
        this.citiesLayerGroup = L.layerGroup();
        this.map.addLayer(this.citiesLayerGroup);
    }
    CitiesManager.prototype.createCities = function (cities, planningType) {
        var _this = this;
        this.currentPlanningType = planningType;
        this.cities = cities;
        var filteredCities = _.filter(cities, function (city) {
            return !_.contains(_this.countriesManager.selectedCountries, city.countryCode);
        });
        this.citiesToMarkers = [];
        this.citiesLayerGroup.clearLayers();
        filteredCities.forEach(function (city) {
            var cityMarker = _this.createCity(city);
            _this.addCityToMarker(city, cityMarker);
        });
    };
    CitiesManager.prototype.hideCityMarkersByCountry = function (countryCode) {
        var _this = this;
        var cityMarkerPairs = this.getCitesMarkersByCountry(countryCode);
        cityMarkerPairs.forEach(function (pair) {
            _this.citiesLayerGroup.removeLayer(pair.marker);
            pair = null;
        });
        this.citiesToMarkers = _.reject(this.citiesToMarkers, function (i) { return i === null; });
    };
    CitiesManager.prototype.showCityMarkersByCountry = function (countryCode) {
        var _this = this;
        var cities = this.getCitesByCountry(countryCode);
        cities.forEach(function (city) {
            var cityMarker = _this.createCity(city);
            _this.addCityToMarker(city, cityMarker);
        });
    };
    CitiesManager.prototype.addCityToMarker = function (city, marker) {
        this.citiesToMarkers.push({ city: city, marker: marker });
    };
    CitiesManager.prototype.getCitesMarkersByCountry = function (countryCode) {
        var pairs = _.filter(this.citiesToMarkers, function (pair) { return pair.city.countryCode === countryCode; });
        return pairs;
    };
    CitiesManager.prototype.getCitesByCountry = function (countryCode) {
        var cities = _.filter(this.cities, function (city) { return city.countryCode === countryCode; });
        return cities;
    };
    CitiesManager.prototype.createCity = function (city) {
        var _this = this;
        var icon = city.selected ? this.graph.selectedIcon : this.graph.cityIcon;
        var marker = L.marker([city.coord.Lat, city.coord.Lng], { icon: icon });
        marker.selected = city.selected;
        marker.gid = city.gid;
        marker.on("mouseover", function (e) {
            e.target.setIcon(_this.graph.focusIcon);
        });
        marker.on("mouseout", function (e) {
            if (!e.target.selected) {
                e.target.setIcon(_this.graph.cityIcon);
            }
            else {
                e.target.setIcon(_this.graph.selectedIcon);
            }
        });
        marker.on("click", function (e) {
            _this.callChangeCitySelection(_this.currentPlanningType, e.target.gid, !e.target.selected, function (res) {
                e.target.setIcon(_this.graph.selectedIcon);
                e.target.selected = !e.target.selected;
            });
        });
        marker.addTo(this.citiesLayerGroup);
        return marker;
    };
    CitiesManager.prototype.callChangeCitySelection = function (planningType, gid, selected, callback) {
        var data = PlanningSender.createRequest(planningType, "cities", {
            gid: gid,
            selected: selected
        });
        PlanningSender.updateProp(data, function (response) {
            callback(response);
        });
    };
    return CitiesManager;
})();
var PlanningType;
(function (PlanningType) {
    PlanningType[PlanningType["Anytime"] = 0] = "Anytime";
    PlanningType[PlanningType["Weekend"] = 1] = "Weekend";
    PlanningType[PlanningType["Custom"] = 2] = "Custom";
})(PlanningType || (PlanningType = {}));
//# sourceMappingURL=PlanningView.js.map