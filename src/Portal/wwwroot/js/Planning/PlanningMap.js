var Planning;
(function (Planning) {
    var PlanningMap = (function () {
        function PlanningMap() {
            var _this = this;
            this.map = new Planning.Map();
            this.map.init("map");
            this.map.onCountryChange = function (cc, isSelected) {
                _this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);
                var data = Planning.PlanningSender.createRequest(_this.planningType, "countries", {
                    countryCode: cc,
                    selected: isSelected
                });
                Planning.PlanningSender.updateProp(data, function (response) {
                });
            };
            this.map.onMapLoaded = function () {
                _this.loadCategory(Planning.PlanningType.Anytime);
                _this.onMapLoaded();
            };
        }
        PlanningMap.prototype.loadCategory = function (pt) {
            this.planningType = pt;
            this.initCountries();
        };
        PlanningMap.prototype.initCountries = function () {
            var _this = this;
            this.getTabData(this.planningType, function (data) {
                _this.viewData = data;
                _this.map.setCountries(_this.viewData.countryCodes);
            });
        };
        PlanningMap.prototype.getTabData = function (planningType, callback) {
            var prms = [["planningType", planningType.toString()]];
            Views.ViewBase.currentView.apiGet("PlanningProperty", prms, function (response) {
                callback(response);
            });
        };
        return PlanningMap;
    }());
    Planning.PlanningMap = PlanningMap;
})(Planning || (Planning = {}));
//# sourceMappingURL=PlanningMap.js.map