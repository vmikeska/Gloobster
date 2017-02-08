var Planning;
(function (Planning) {
    var PlanningMap = (function () {
        function PlanningMap(dealsSearch) {
            this.viewType = FlightCacheRecordType.Country;
            this.dealsSearch = dealsSearch;
        }
        PlanningMap.prototype.init = function () {
            this.initMap();
            this.initCountriesFnc();
            this.initCitiesFnc();
        };
        PlanningMap.prototype.changeViewType = function (type) {
            this.viewType = type;
            this.map.switch(this.viewType);
        };
        PlanningMap.prototype.initMap = function () {
            var _this = this;
            this.map = new Planning.Map(this);
            this.map.onMapLoaded = function () {
                _this.onMapLoaded();
            };
            this.map.init();
        };
        PlanningMap.prototype.initCountriesFnc = function () {
            var _this = this;
            this.map.onCountryChange = function (cc, isSelected) {
                _this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);
                var customId = _this.dealsSearch.currentSetter.getCustomId();
                var data = { type: _this.planningType, cc: cc, selected: isSelected, customId: customId };
                _this.dealsSearch.v.apiPut("SelCountry", data, function () { });
            };
        };
        PlanningMap.prototype.initCitiesFnc = function () {
            var _this = this;
            this.map.onCityChange = function (gid, isSelected) {
                _this.onSelectionChanged(gid, isSelected, FlightCacheRecordType.City);
                var customId = _this.dealsSearch.currentSetter.getCustomId();
                var data = { type: _this.planningType, gid: gid, selected: isSelected, customId: customId };
                _this.dealsSearch.v.apiPut("SelCity", data, function () { });
            };
        };
        PlanningMap.prototype.loadCategory = function (pt) {
            this.planningType = pt;
            this.initData();
        };
        PlanningMap.prototype.initData = function () {
            var _this = this;
            this.getSelectedCCs(this.planningType, function (ccs) {
                _this.map.mapCountries.set(ccs);
                _this.map.switch(_this.viewType);
            });
        };
        PlanningMap.prototype.getSelectedCCs = function (planningType, callback) {
            var customId = this.dealsSearch.currentSetter.getCustomId();
            var prms = [["type", planningType.toString()], ["customId", customId]];
            Views.ViewBase.currentView.apiGet("SelCountry", prms, function (response) {
                callback(response);
            });
        };
        return PlanningMap;
    }());
    Planning.PlanningMap = PlanningMap;
})(Planning || (Planning = {}));
//# sourceMappingURL=PlanningMap.js.map