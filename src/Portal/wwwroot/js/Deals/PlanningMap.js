var Planning;
(function (Planning) {
    var PlanningMap = (function () {
        function PlanningMap(config) {
            this.viewType = FlightCacheRecordType.Country;
            this.inited = false;
            this.config = config;
        }
        Object.defineProperty(PlanningMap.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        PlanningMap.prototype.init = function () {
            if (this.inited) {
                this.map.currentMap.show();
                return;
            }
            this.inited = true;
            this.initMap();
            this.initCountriesFnc();
            this.initCitiesFnc();
        };
        PlanningMap.prototype.initMap = function () {
            this.map = new Planning.Map(this);
            this.map.init();
            this.initMapSwitch();
        };
        PlanningMap.prototype.initCountriesFnc = function () {
            var _this = this;
            this.map.onCountryChange = function (cc, isSelected) {
                if (_this.onSelectionChanged) {
                    _this.onSelectionChanged(cc, isSelected, FlightCacheRecordType.Country);
                }
                var customId = _this.config.getCustomId();
                var data = { type: _this.config.type, cc: cc, selected: isSelected, customId: customId };
                _this.v.apiPut("SelCountry", data, function () { });
            };
        };
        PlanningMap.prototype.initCitiesFnc = function () {
            var _this = this;
            this.map.onCityChange = function (gid, isSelected) {
                if (_this.onSelectionChanged) {
                    _this.onSelectionChanged(gid, isSelected, FlightCacheRecordType.City);
                }
                var customId = _this.config.getCustomId();
                var data = { type: _this.config.type, gid: gid, selected: isSelected, customId: customId };
                _this.v.apiPut("SelCity", data, function () { });
            };
        };
        PlanningMap.prototype.initMapSwitch = function () {
            var _this = this;
            var $cont = $(".map-type-switch");
            var $btns = $cont.find(".btn");
            $btns.click(function (e) {
                var $t = $(e.target);
                var type = $t.hasClass("country") ? FlightCacheRecordType.Country : FlightCacheRecordType.City;
                if (type === _this.viewType) {
                    return;
                }
                _this.viewType = type;
                $btns.removeClass("active");
                $t.addClass("active");
                _this.map.switch(_this.viewType);
            });
        };
        return PlanningMap;
    }());
    Planning.PlanningMap = PlanningMap;
})(Planning || (Planning = {}));
//# sourceMappingURL=PlanningMap.js.map