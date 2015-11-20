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
var PlanningMap = (function () {
    function PlanningMap(planningType, map) {
        var _this = this;
        this.borderColor = "#000000";
        this.fillColorUnselected = "#CFCAC8";
        this.fillColorSelected = "#57CF5F";
        this.fillColorHover = "#57CF9D";
        this.map = map;
        this.countryShapes = new CountryShapes();
        this.initConfigs();
        this.getTabData(planningType, function (data) {
            _this.viewData = data;
            _this.createCountries(_this.viewData.countryCodes);
        });
    }
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
                }
                else {
                    _this.selectedCountries.push(countryCode);
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