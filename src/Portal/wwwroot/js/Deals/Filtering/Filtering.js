var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Planning;
(function (Planning) {
    var Filtering = (function () {
        function Filtering() {
            this.$root = $(".filtering");
            this.$locRoot = this.$root.find(".locations");
            this.activeCls = "active";
        }
        Filtering.prototype.init = function (locationItems, activeLocation) {
            this.genLocations(locationItems, activeLocation);
        };
        Filtering.prototype.getStateBase = function () {
            var $actItem = this.$locRoot.find("." + this.activeCls);
            return {
                grouping: $actItem.data("type")
            };
        };
        Filtering.prototype.stateChanged = function () {
            if (this.onFilterChanged) {
                this.onFilterChanged();
            }
        };
        Filtering.prototype.getLocsData = function (items) {
            var locs = _.map(items, function (i) {
                var base = {
                    icon: "",
                    txt: "",
                    type: i
                };
                var v = Views.ViewBase.currentView;
                if (i === Planning.LocationGrouping.ByCity) {
                    base.icon = "city";
                    base.txt = v.t("ByCity", "jsDeals");
                }
                if (i === Planning.LocationGrouping.ByCountry) {
                    base.icon = "country";
                    base.txt = v.t("ByCountry", "jsDeals");
                }
                if (i === Planning.LocationGrouping.ByContinent) {
                    base.icon = "continent";
                    base.txt = v.t("ByContinent", "jsDeals");
                }
                return base;
            });
            return locs;
        };
        Filtering.prototype.genLocations = function (items, active) {
            var _this = this;
            var locs = this.getLocsData(items);
            var lg = Common.ListGenerator.init(this.$locRoot, "filter-location-template");
            lg.activeItem = function (item) {
                var res = {
                    cls: _this.activeCls,
                    isActive: false
                };
                if (item.type === active) {
                    res.isActive = true;
                }
                return res;
            };
            lg.evnt(null, function (e, $item, $target, item) {
                _this.$locRoot.children().removeClass(_this.activeCls);
                $item.addClass(_this.activeCls);
                _this.stateChanged();
            });
            lg.generateList(locs);
        };
        return Filtering;
    }());
    Planning.Filtering = Filtering;
    var FilteringAnytime = (function (_super) {
        __extends(FilteringAnytime, _super);
        function FilteringAnytime() {
            _super.apply(this, arguments);
            this.fromDays = 1;
            this.toDays = 20;
        }
        FilteringAnytime.prototype.initA = function (locationItems, activeLocation) {
            this.init(locationItems, activeLocation);
        };
        FilteringAnytime.prototype.daysRangeChanged = function (from, to) {
            this.fromDays = from;
            this.toDays = to;
            this.onFilterChanged();
        };
        return FilteringAnytime;
    }(Filtering));
    Planning.FilteringAnytime = FilteringAnytime;
    var FilteringWeekend = (function (_super) {
        __extends(FilteringWeekend, _super);
        function FilteringWeekend() {
            _super.apply(this, arguments);
        }
        FilteringWeekend.prototype.initW = function (locationItems, activeLocation, useDaysFilter) {
            var _this = this;
            var t = Views.ViewBase.currentView.registerTemplate("filtering-weekend-template");
            var $cont = this.$root.find(".sec-line");
            $cont.html(t());
            this.init(locationItems, activeLocation);
            this.daysFilter = new Planning.DaysFilter($cont.find("#cbUseDaysFilter"), $cont.find(".days-filter"));
            this.daysFilter.onFilterChange = function () {
                _this.stateChanged();
            };
            this.daysFilter.init(useDaysFilter);
        };
        FilteringWeekend.prototype.getState = function () {
            var bs = this.getStateBase();
            var days = null;
            if (this.daysFilter.cbUse.isChecked()) {
                days = this.daysFilter.getActItems();
            }
            var ls = {
                days: days
            };
            var s = $.extend(bs, ls);
            return s;
        };
        return FilteringWeekend;
    }(Filtering));
    Planning.FilteringWeekend = FilteringWeekend;
})(Planning || (Planning = {}));
//# sourceMappingURL=Filtering.js.map