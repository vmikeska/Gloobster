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
var TaggingField = (function () {
    function TaggingField(customId, containerId, itemsRange) {
        this.customId = customId;
        this.itemsRange = itemsRange;
        this.taggerTemplate = Views.ViewBase.currentView.registerTemplate("tagger-template");
        this.$cont = $("#" + containerId);
        this.$tagger = this.createTagger(itemsRange);
        this.$cont.prepend(this.$tagger);
    }
    TaggingField.prototype.setSelectedItems = function (selectedItems) {
        this.selectedItems = selectedItems;
        this.initTags(selectedItems);
    };
    TaggingField.prototype.initTags = function (selectedItems) {
        var _this = this;
        this.$cont.find(".tag").remove();
        selectedItems.forEach(function (selectedItem) {
            var item = _.find(_this.itemsRange, function (i) { return i.kind === selectedItem.kind && i.value === selectedItem.value; });
            if (item) {
                var $html = _this.createTag(item.text, item.value, item.kind);
                _this.$cont.prepend($html);
            }
        });
    };
    TaggingField.prototype.createTag = function (text, value, kind) {
        var html = "<a class=\"tag\" href=\"#\" data-vl=\"" + value + "\" data-kd=\"" + kind + "\">" + text + "</a>";
        var $html = $(html);
        return $html;
    };
    TaggingField.prototype.createTagger = function (items) {
        var _this = this;
        var html = this.taggerTemplate();
        var $html = $(html);
        var $input = $html.find("input");
        var $ul = $html.find("ul");
        $input.keyup(function (e) {
            _this.fillTagger($input, items, $ul);
        });
        $input.focus(function (e) {
            _this.fillTagger($input, items, $ul);
            $ul.show();
        });
        $input.focusout(function (e) {
            setTimeout(function () {
                $input.val("");
                $ul.hide();
            }, 250);
        });
        return $html;
    };
    TaggingField.prototype.fillTagger = function ($input, items, $ul) {
        var _this = this;
        $ul.html("");
        items.forEach(function (item) {
            var inputVal = $input.val();
            var strMatch = (inputVal === "") || (item.text.indexOf(inputVal) > -1);
            var alreadySelected = _.find(_this.selectedItems, function (i) { return i.kind === item.kind && i.value === item.value; });
            if (strMatch && !alreadySelected) {
                var $item = _this.createTaggerItem(item.text, item.value, item.kind);
                $ul.append($item);
            }
        });
    };
    TaggingField.prototype.createTaggerItem = function (text, value, kind) {
        var _this = this;
        var html = "<li data-vl=\"" + value + "\" data-kd=\"" + kind + "\">" + text + "</li>";
        var $html = $(html);
        $html.click(function (e) {
            var $target = $(e.target);
            _this.onItemClicked($target);
        });
        return $html;
    };
    TaggingField.prototype.onItemClicked = function ($target) {
        var _this = this;
        var val = $target.data("vl");
        var kind = $target.data("kd");
        var text = $target.text();
        this.onItemClickedCustom($target, function () {
            var $tag = _this.createTag(text, val, kind);
            _this.$tagger.before($tag);
            _this.selectedItems.push({ value: val, kind: kind });
        });
    };
    return TaggingField;
})();
var CustomForm = (function () {
    function CustomForm(data) {
        var _this = this;
        this.data = data;
        this.namesList = new NamesList(data.searches);
        this.namesList.onSearchChanged = function (search) { return _this.onSearchChanged(search); };
        this.registerDuration();
        this.initTimeTagger(this.namesList.currentSearch);
        this.fillForm(this.namesList.currentSearch);
    }
    CustomForm.prototype.onSearchChanged = function (search) {
        this.fillForm(search);
    };
    CustomForm.prototype.fillForm = function (search) {
        var timeSelectedItems = this.getTimeTaggerSelectedItems(search);
        this.timeTagger.setSelectedItems(timeSelectedItems);
        this.initDuration(search.roughlyDays);
    };
    CustomForm.prototype.initTimeTagger = function (search) {
        var _this = this;
        var itemsRange = [
            { text: "January", value: 1, kind: "month" },
            { text: "February", value: 2, kind: "month" },
            { text: "March", value: 3, kind: "month" },
            { text: "April", value: 4, kind: "month" },
            { text: "May", value: 5, kind: "month" },
            { text: "June", value: 6, kind: "month" },
            { text: "July", value: 7, kind: "month" },
            { text: "August", value: 8, kind: "month" },
            { text: "September", value: 9, kind: "month" },
            { text: "October", value: 10, kind: "month" },
            { text: "November", value: 11, kind: "month" },
            { text: "December", value: 12, kind: "month" },
            { text: "year 2015", value: 2015, kind: "year" },
            { text: "year 2016", value: 2016, kind: "year" }
        ];
        this.timeTagger = new TaggingField(search.id, "timeTagger", itemsRange);
        this.timeTagger.onItemClickedCustom = function ($target, callback) {
            var val = $target.data("vl");
            var kind = $target.data("kd");
            var text = $target.text();
            var data = PlanningSender.createRequest(PlanningType.Custom, "time", {
                kind: kind,
                value: val,
                id: _this.namesList.currentSearch.id
            });
            PlanningSender.pushProp(data, function (res) {
                callback(res);
            });
        };
    };
    CustomForm.prototype.getTimeTaggerSelectedItems = function (search) {
        var selectedItems = [];
        search.months.forEach(function (month) {
            selectedItems.push({ value: month, kind: "month" });
        });
        search.years.forEach(function (year) {
            selectedItems.push({ value: year, kind: "year" });
        });
        return selectedItems;
    };
    CustomForm.prototype.initDuration = function (days) {
        if (days === 0) {
            this.setRadio(1, true);
        }
        else if (days === 3) {
            this.setRadio(2, true);
        }
        else if (days === 7) {
            this.setRadio(3, true);
        }
        else if (days === 14) {
            this.setRadio(4, true);
        }
        else {
            this.setRadio(5, true);
            $("#customLength").show();
            $("#customLength").val(days);
        }
    };
    CustomForm.prototype.setRadio = function (no, val) {
        $("#radio" + no).prop("checked", val);
    };
    CustomForm.prototype.registerDuration = function () {
        var _this = this;
        var dc = new DelayedCallback("customLength");
        dc.callback = function (val) {
            var intVal = parseInt(val);
            if (intVal) {
                _this.callUpdateMinLength(intVal);
            }
        };
        var $lengthRadio = $("input[type=radio][name=radio]");
        var $customLength = $("#customLength");
        $lengthRadio.change(function (e) {
            var $target = $(e.target);
            var val = $target.data("vl");
            if (val === "custom") {
                $customLength.show();
            }
            else {
                $customLength.hide();
                _this.callUpdateMinLength(parseInt(val));
            }
        });
    };
    CustomForm.prototype.callUpdateMinLength = function (roughlyDays) {
        var data = PlanningSender.createRequest(PlanningType.Custom, "roughlyDays", {
            id: this.namesList.currentSearch.id,
            days: roughlyDays
        });
        PlanningSender.updateProp(data, function (res) {
        });
    };
    return CustomForm;
})();
var NamesList = (function () {
    function NamesList(searches) {
        var _this = this;
        this.searches = [];
        this.isEditMode = false;
        this.searches = searches;
        this.$nameInput = $("#nameInput");
        this.$nameSaveBtn = $("#nameSaveBtn");
        this.$nameEditBtn = $("#nameEditBtn");
        this.$selectedSpan = $("#selectedSpan");
        this.$searchesList = $("#searchesList");
        this.$addNewItem = $("#addNewItem");
        this.$nameEditBtn.click(function () { return _this.editClick(); });
        this.$nameSaveBtn.click(function () { return _this.saveClick(); });
        this.$addNewItem.click(function () {
            var data = PlanningSender.createRequest(PlanningType.Custom, "createNewSearch", {
                searchName: 'new search'
            });
            PlanningSender.pushProp(data, function (newSearch) {
                searches.push(newSearch);
                _this.currentSearch = newSearch;
                _this.onSearchChanged(newSearch);
            });
        });
        this.fillList();
    }
    NamesList.prototype.fillList = function () {
        var _this = this;
        this.$searchesList.html("");
        this.searches.forEach(function (search) {
            var itemHtml = "<li data-si=\"" + search.id + "\">" + search.searchName + "<button>del</button></li>";
            var $item = $(itemHtml);
            _this.$searchesList.append($item);
            $item.click(function (e) {
                _this.itemClick($item);
            });
        });
        this.currentSearch = this.searches[0];
        this.$selectedSpan.text(this.currentSearch.searchName);
    };
    NamesList.prototype.itemClick = function ($item) {
        var searchId = $item.data("si");
        var search = _.find(this.searches, function (search) { return search.id === searchId; });
        this.currentSearch = search;
        this.onSearchChanged(search);
    };
    NamesList.prototype.setForm = function (search) {
    };
    NamesList.prototype.saveClick = function () {
        var _this = this;
        var newName = this.$nameInput.val();
        var data = PlanningSender.createRequest(PlanningType.Custom, "renameSearch", {
            id: this.currentSearch.id,
            searchName: newName
        });
        PlanningSender.updateProp(data, function (res) {
            _this.currentSearch.searchName = newName;
            _this.$nameInput.hide();
            _this.$selectedSpan.show();
            //this.$searchesList.show();
            _this.$nameEditBtn.show();
            _this.$nameSaveBtn.hide();
            _this.isEditMode = false;
            _this.$selectedSpan.text(newName);
            _this.$searchesList.find("li[data-si='" + _this.currentSearch.id + "']").text(newName);
            //this.fillList();
        });
    };
    NamesList.prototype.editClick = function () {
        this.$nameInput.show();
        this.$nameInput.val(this.currentSearch.searchName);
        this.$selectedSpan.hide();
        //this.$searchesList.hide();
        this.$nameEditBtn.hide();
        this.$nameSaveBtn.show();
        this.isEditMode = true;
    };
    return NamesList;
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
            if (_this.currentPlanningType === PlanningType.Custom) {
                _this.customForm = new CustomForm(data);
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
    PlanningSender.pushProp = function (data, callback) {
        Views.ViewBase.currentView.apiPost("PlanningProperty", data, function (response) {
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