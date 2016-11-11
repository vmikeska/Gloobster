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
            this.$levels = this.$root.find(".levels");
            this.$l5 = this.$levels.find(".lev5");
            this.$l3 = this.$levels.find(".lev3");
            this.$l1 = this.$levels.find(".lev1");
            this.currentStarsCnt = 5;
            this.currentLevel = ScoreLevel.Excellent;
        }
        Filtering.prototype.init = function (locationItems, activeLocation) {
            this.genLocations(locationItems, activeLocation);
            this.initLevels();
        };
        Filtering.prototype.getStateBase = function () {
            var $actItem = this.$locRoot.find("." + this.activeCls);
            return {
                grouping: $actItem.data("type"),
                starsLevel: this.currentStarsCnt,
                currentLevel: this.currentLevel
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
                if (i === Planning.LocationGrouping.ByCity) {
                    base.icon = "city";
                    base.txt = "By city";
                }
                if (i === Planning.LocationGrouping.ByCountry) {
                    base.icon = "country";
                    base.txt = "By country";
                }
                if (i === Planning.LocationGrouping.ByContinent) {
                    base.icon = "continent";
                    base.txt = "By continent";
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
        Filtering.prototype.initLevels = function () {
            var _this = this;
            var $levels = this.$root.find(".level");
            $levels.mouseenter(function (e) {
                $levels.removeClass("active");
                var $t = $(e.delegateTarget);
                if ($t.hasClass("lev5")) {
                    _this.levelsHover(5);
                }
                if ($t.hasClass("lev3")) {
                    _this.levelsHover(3);
                }
                if ($t.hasClass("lev1")) {
                    _this.levelsHover(1);
                }
            });
            $levels.mouseleave(function (e) {
                $levels.removeClass("active");
                _this.levelsHover(_this.currentStarsCnt);
            });
            $levels.click(function (e) {
                var $t = $(e.delegateTarget);
                var val = $t.data("s");
                _this.currentStarsCnt = val;
                if (val === 5) {
                    _this.currentLevel = ScoreLevel.Excellent;
                }
                if (val === 3) {
                    _this.currentLevel = ScoreLevel.Good;
                }
                if (val === 1) {
                    _this.currentLevel = ScoreLevel.Standard;
                }
                _this.stateChanged();
            });
        };
        Filtering.prototype.levelsHover = function (stars) {
            this.$l5.addClass("active");
            if (stars <= 3) {
                this.$l3.addClass("active");
            }
            if (stars <= 1) {
                this.$l1.addClass("active");
            }
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
    var MonthsSelector = (function () {
        function MonthsSelector($cont) {
            this.actCls = "active";
            this.$comp = $("<div class=\"months-filter\"></div>");
            $cont.html(this.$comp);
        }
        MonthsSelector.prototype.gen = function (cnt) {
            var _this = this;
            var items = this.getItems(cnt);
            var f = _.first(items);
            this.year = f.year;
            this.month = f.month;
            var lg = Common.ListGenerator.init(this.$comp, "month-item-filter-template");
            lg.evnt(null, function (e, $item, $target, item) {
                _this.month = item.month;
                _this.year = item.year;
                _this.$comp.find(".month").removeClass(_this.actCls);
                $item.addClass(_this.actCls);
                _this.change();
            });
            var isFirst = true;
            lg.activeItem = function (item) {
                var r = {
                    cls: "active",
                    isActive: isFirst
                };
                isFirst = false;
                return r;
            };
            lg.generateList(items);
        };
        MonthsSelector.prototype.change = function () {
            if (this.onChange) {
                this.onChange();
            }
        };
        MonthsSelector.prototype.getItems = function (cnt) {
            var today = new Date();
            var items = [];
            for (var act = 0; act <= cnt - 1; act++) {
                var newDate = moment(today).add(act, "months");
                var txt = newDate.format("MMMM YY");
                var item = {
                    txt: txt,
                    month: newDate.month() + 1,
                    year: newDate.year()
                };
                items.push(item);
            }
            return items;
        };
        return MonthsSelector;
    }());
    Planning.MonthsSelector = MonthsSelector;
    var RangeSlider = (function () {
        function RangeSlider($cont, id) {
            this.$cont = $cont;
            this.id = id;
        }
        RangeSlider.prototype.getRange = function () {
            return {
                from: parseInt(this.$from.val()),
                to: parseInt(this.$to.val())
            };
        };
        RangeSlider.prototype.rangeChanged = function (from, to) {
            if (this.onRangeChanged) {
                this.onRangeChanged(from, to);
            }
        };
        RangeSlider.prototype.genSlider = function (min, max) {
            var _this = this;
            var t = Views.ViewBase.currentView.registerTemplate("range-slider-template");
            var context = {
                id: this.id
            };
            var $t = $(t(context));
            this.$cont.html($t);
            var slider = $t.find("#" + this.id)[0];
            this.$from = $("#" + this.id + "_from");
            this.$to = $("#" + this.id + "_to");
            this.$from.val(min);
            this.$to.val(max);
            var si = noUiSlider.create(slider, {
                start: [min + 1, max - 1],
                connect: true,
                step: 1,
                range: {
                    "min": min,
                    "max": max
                }
            });
            var fromCall = new Common.DelayedCallback(this.$from);
            fromCall.delay = 500;
            fromCall.callback = function (val) {
                var fixedVal = val;
                if (val < min) {
                    fixedVal = min;
                    _this.$from.val(fixedVal);
                }
                si.set([fixedVal, null]);
                _this.rangeChanged(fixedVal, _this.$to.val());
            };
            var toCall = new Common.DelayedCallback(this.$to);
            toCall.delay = 500;
            toCall.callback = function (val) {
                var fixedVal = val;
                if (val > max) {
                    fixedVal = max;
                    _this.$to.val(fixedVal);
                }
                si.set([null, fixedVal]);
                _this.rangeChanged(_this.$from.val(), fixedVal);
            };
            si.on("slide", function (range) {
                var from = parseInt(range[0]);
                var to = parseInt(range[1]);
                _this.$from.val(from);
                _this.$to.val(to);
                _this.rangeChanged(from, to);
            });
        };
        return RangeSlider;
    }());
    Planning.RangeSlider = RangeSlider;
    var FilteringWeekend = (function (_super) {
        __extends(FilteringWeekend, _super);
        function FilteringWeekend() {
            _super.apply(this, arguments);
        }
        FilteringWeekend.prototype.initW = function (locationItems, activeLocation, longWeek) {
            var _this = this;
            var t = Views.ViewBase.currentView.registerTemplate("filtering-weekend-template");
            this.$root.find(".sec-line").html(t());
            this.cbLong = new Common.CustomCheckbox(this.$root.find("#cbLongWeekend"), longWeek);
            this.cbLong.onChange = function () {
                _this.stateChanged();
            };
            this.init(locationItems, activeLocation);
        };
        FilteringWeekend.prototype.getState = function () {
            var bs = this.getStateBase();
            var ls = {
                longWeek: this.cbLong.isChecked()
            };
            var s = $.extend(bs, ls);
            return s;
        };
        return FilteringWeekend;
    }(Filtering));
    Planning.FilteringWeekend = FilteringWeekend;
})(Planning || (Planning = {}));
//# sourceMappingURL=Filtering.js.map