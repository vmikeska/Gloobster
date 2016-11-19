var Planning;
(function (Planning) {
    var PlanningMap = (function () {
        function PlanningMap() {
            this.viewType = FlightCacheRecordType.Country;
        }
        PlanningMap.prototype.init = function () {
            this.initMap();
            this.initCountriesFnc();
            this.initCitiesFnc();
        };
        PlanningMap.prototype.changeViewType = function (type) {
            this.viewType = type;
            var data = this.getViewTypeData();
            this.map.switch(this.viewType, data);
        };
        PlanningMap.prototype.initMap = function () {
            var _this = this;
            this.map = new Planning.Map(this);
            this.map.onMapLoaded = function () {
                _this.onMapLoaded();
            };
            this.map.init("map");
        };
        PlanningMap.prototype.initCountriesFnc = function () {
            var _this = this;
            this.map.onCountryChange = function (cc, isSelected) {
                _this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);
                var data = Planning.PlanningSender.createRequest(_this.planningType, "countries", {
                    countryCode: cc,
                    selected: isSelected
                });
                Planning.PlanningSender.updateProp(data, function (response) { });
            };
        };
        PlanningMap.prototype.initCitiesFnc = function () {
            var _this = this;
            this.map.onCityChange = function (gid, isSelected) {
                _this.onSelectionChanged(gid, isSelected, FlightCacheRecordType.City);
                var data = Planning.PlanningSender.createRequest(_this.planningType, "cities", {
                    gid: gid,
                    selected: isSelected
                });
                Planning.PlanningSender.updateProp(data, function (response) { });
            };
        };
        PlanningMap.prototype.loadCategory = function (pt) {
            this.planningType = pt;
            this.initData();
        };
        PlanningMap.prototype.initData = function () {
            var _this = this;
            this.getTabData(this.planningType, function (data) {
                _this.viewData = data;
                var vData = _this.getViewTypeData();
                _this.map.switch(_this.viewType, vData);
            });
        };
        PlanningMap.prototype.getTabData = function (planningType, callback) {
            var prms = [["planningType", planningType.toString()]];
            Views.ViewBase.currentView.apiGet("PlanningProperty", prms, function (response) {
                callback(response);
            });
        };
        PlanningMap.prototype.getViewTypeData = function () {
            if (this.viewType === FlightCacheRecordType.Country) {
                return this.viewData.countryCodes;
            }
            else {
                return this.viewData.cities;
            }
        };
        return PlanningMap;
    }());
    Planning.PlanningMap = PlanningMap;
})(Planning || (Planning = {}));
//# sourceMappingURL=PlanningMap.js.map