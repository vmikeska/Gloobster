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
            this.daysFilter = new DaysFilter($cont.find("#cbUseDaysFilter"), $cont.find(".days-filter"));
            this.daysFilter.onFilterChange = function () {
                _this.stateChanged();
            };
            this.daysFilter.init(useDaysFilter);
        };
        FilteringWeekend.prototype.getState = function () {
            var bs = this.getStateBase();
            var days = this.daysFilter.getActItems();
            var ls = {
                days: days
            };
            var s = $.extend(bs, ls);
            return s;
        };
        return FilteringWeekend;
    }(Filtering));
    Planning.FilteringWeekend = FilteringWeekend;
    var DaysFilter = (function () {
        function DaysFilter($cbCont, $filterCont) {
            this.enabled = false;
            this.$cbCont = $cbCont;
            this.$filterCont = $filterCont;
        }
        DaysFilter.prototype.init = function (useDaysFilter) {
            this.initCb(useDaysFilter);
            this.initSelect();
        };
        DaysFilter.prototype.initCb = function (useDaysFilter) {
            var _this = this;
            this.cbUse = new Common.CustomCheckbox(this.$cbCont, useDaysFilter);
            this.cbUse.onChange = function () {
                var state = _this.cbUse.isChecked();
                _this.setEnabled(state);
            };
            this.setEnabled(useDaysFilter);
        };
        DaysFilter.prototype.setEnabled = function (state) {
            this.enabled = state;
            var $c = this.$filterCont;
            if (state) {
                $c.addClass("enabled");
                $c.removeClass("disabled");
            }
            else {
                $c.removeClass("enabled");
                $c.addClass("disabled");
            }
        };
        DaysFilter.prototype.initSelect = function () {
            var _this = this;
            var items = [
                { ni: 4, name: "Thu" },
                { ni: 5, name: "Fri" },
                { ni: 6, name: "Sat", c: "perm-sel" },
                { ni: 7, name: "Sun" },
                { ni: 1, name: "Mon" }
            ];
            var lg = Common.ListGenerator.init(this.$filterCont.find(".ftbl"), "weekend-day-selector-template");
            lg.onItemAppended = function ($item, item) {
                if (item.ni === 5 || item.ni === 7) {
                    $item.find(".day").addClass("act");
                }
            };
            lg.evnt(".day", function (e, $item, $target, item) {
                _this.itemClicked(item.ni);
            });
            lg.evnt(".day", function (e, $item, $target, item) {
                _this.showFocus(item.ni);
            })
                .setEvent("mouseenter");
            lg.evnt(".day", function (e, $item, $target, item) {
                _this.unsetFocus();
            })
                .setEvent("mouseleave");
            lg.generateList(items);
        };
        DaysFilter.prototype.removeActNo = function (no) {
            var $i = this.getItemByNo(no);
            $i.removeClass("act");
        };
        DaysFilter.prototype.addActNo = function (no) {
            var $i = this.getItemByNo(no);
            $i.addClass("act");
        };
        DaysFilter.prototype.itemClicked = function (no) {
            if (!this.enabled) {
                return;
            }
            var $i = this.getItemByNo(no);
            var isAct = $i.hasClass("act");
            if (no === 4) {
                this.remAdd(isAct ? [4] : null, isAct ? null : [4, 5]);
            }
            if (no === 5) {
                this.remAdd(isAct ? [4, 5] : null, isAct ? null : [5]);
            }
            if (no === 7) {
                this.remAdd(isAct ? [7, 1] : null, isAct ? null : [7]);
            }
            if (no === 1) {
                this.remAdd(isAct ? [1] : null, isAct ? null : [7, 1]);
            }
            if (this.onFilterChange) {
                this.onFilterChange();
            }
        };
        DaysFilter.prototype.remAdd = function (remms, adds) {
            var _this = this;
            if (remms) {
                remms.forEach(function (r) {
                    _this.removeActNo(r);
                });
            }
            if (adds) {
                adds.forEach(function (a) {
                    _this.addActNo(a);
                });
            }
        };
        DaysFilter.prototype.getActItems = function () {
            var acts = this.$filterCont.find(".act").toArray();
            var o = _.map(acts, function (a) { return parseInt($(a).data("i")); });
            var from = 6;
            if (_.contains(o, 5)) {
                from = 5;
            }
            if (_.contains(o, 4)) {
                from = 4;
            }
            var to = 6;
            if (_.contains(o, 7)) {
                to = 7;
            }
            if (_.contains(o, 1)) {
                to = 1;
            }
            return { from: from, to: to };
        };
        DaysFilter.prototype.showFocus = function (no) {
            var _this = this;
            if (!this.enabled) {
                return;
            }
            var nos = [];
            if (no === 4) {
                nos = [4, 5];
            }
            if (no === 5) {
                nos = [5];
            }
            if (no === 7) {
                nos = [7];
            }
            if (no === 1) {
                nos = [7, 1];
            }
            nos.forEach(function (noi) {
                _this.setFocus(noi);
            });
        };
        DaysFilter.prototype.unsetFocus = function () {
            this.$filterCont.find(".day").removeClass("foc");
        };
        DaysFilter.prototype.setFocus = function (no) {
            var $i = this.getItemByNo(no);
            $i.addClass("foc");
        };
        DaysFilter.prototype.getItemByNo = function (no) {
            var $i = this.$filterCont.find("[data-i=\"" + no + "\"]");
            return $i;
        };
        return DaysFilter;
    }());
    Planning.DaysFilter = DaysFilter;
})(Planning || (Planning = {}));
//# sourceMappingURL=Filtering.js.map