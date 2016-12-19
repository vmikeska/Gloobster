var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var DelasEval = (function () {
        function DelasEval(timeType, queries) {
            this.res = { Excellent: 0, Good: 0, Standard: 0 };
            this.timeType = timeType;
            this.queries = queries;
        }
        DelasEval.prototype.countDeals = function () {
            var _this = this;
            Planning.FlightsExtractor.f(this.queries, function (f, r, q) {
                var stars = Planning.AnytimeAggUtils.getScoreStars(f.score);
                _this.incCategory(stars);
            });
        };
        DelasEval.prototype.incCategory = function (stars) {
            if (stars >= 4) {
                this.res.Excellent++;
            }
            else if (stars >= 2) {
                this.res.Good++;
            }
            else {
                this.res.Standard++;
            }
        };
        DelasEval.prototype.dispayDeals = function () {
            this.countDeals();
            $("#delasEx").html(this.res.Excellent);
            $("#delasGo").html(this.res.Good);
            $("#delasSt").html(this.res.Standard);
        };
        return DelasEval;
    }());
    Views.DelasEval = DelasEval;
    var FlyView = (function (_super) {
        __extends(FlyView, _super);
        function FlyView() {
            _super.call(this);
            this.$cont = $("#resultsCont");
            this.$filter = $("#filterCont");
            this.initialize();
        }
        FlyView.prototype.showAirsFirst = function () {
            var id = new Common.InfoDialog();
            id.create("No airports", "Location and airports must be selected first");
        };
        Object.defineProperty(FlyView.prototype, "hasAirs", {
            get: function () {
                return this.locDlg.hasAirports();
            },
            enumerable: true,
            configurable: true
        });
        FlyView.prototype.initialize = function () {
            var _this = this;
            this.resultsEngine = new Planning.ResultsManager(this);
            this.resultsEngine.onResultsChanged = function (queries) {
                _this.currentSetter.setQueries(queries);
                var de = new DelasEval(_this.resultsEngine.timeType, queries);
                de.dispayDeals();
            };
            this.planningMap = new Planning.PlanningMap(this);
            this.planningMap.onMapLoaded = function () {
                _this.changeSetter(PlanningType.Anytime);
            };
            this.planningMap.onSelectionChanged = function (id, newState, type) {
                _this.resultsEngine.selectionChanged(id, newState, type);
            };
            this.planningMap.init();
            this.mapSwitch(function (type) {
                _this.planningMap.changeViewType(type);
            });
            this.locDlg = new Views.LocationSettingsDialog(this);
            this.initTabs();
        };
        FlyView.prototype.enableMap = function (state) {
            var disabler = $("#mapDisabler");
            if (state) {
                disabler.removeClass("map-disabled");
            }
            else {
                disabler.addClass("map-disabled");
            }
        };
        FlyView.prototype.mapSwitch = function (callback) {
            var _this = this;
            var $cont = $(".map-type-switch");
            var $btns = $cont.find(".btn");
            $btns.click(function (e) {
                var $t = $(e.target);
                var type = $t.hasClass("country") ? FlightCacheRecordType.Country : FlightCacheRecordType.City;
                if (type === _this.planningMap.viewType) {
                    return;
                }
                $btns.removeClass("active");
                $t.addClass("active");
                callback(type);
            });
        };
        FlyView.prototype.initTabs = function () {
            var _this = this;
            this.tabs = new Common.Tabs($("#naviCont"), "main");
            this.tabs.initCall = false;
            this.tabs.onBeforeSwitch = function () {
                _this.enableMap(true);
                _this.$cont.empty();
                _this.$filter.empty();
            };
            this.tabs.addTab("tabAnytime", "All deals", function () {
                _this.changeSetter(PlanningType.Anytime);
            });
            this.tabs.addTab("tabWeekend", "Weekend deals", function () {
                _this.changeSetter(PlanningType.Weekend);
            });
            this.tabs.addTab("tabCustom", "Long term search", function () {
                _this.changeSetter(PlanningType.Custom);
            });
            this.tabs.addTab("tabClassic", "Classic search", function () {
            });
            this.tabs.create();
        };
        FlyView.prototype.changeSetter = function (type) {
            var _this = this;
            $("#tabContent").empty();
            if (type === PlanningType.Anytime) {
                this.currentSetter = new Planning.AnytimePageSetter(this);
            }
            if (type === PlanningType.Weekend) {
                this.currentSetter = new Planning.WeekendPageSetter(this);
            }
            if (type === PlanningType.Custom) {
                this.currentSetter = new Planning.CustomPageSetter(this);
            }
            this.currentSetter.init(function () {
                _this.planningMap.loadCategory(type);
                _this.resultsEngine.initalCall(type);
            });
        };
        return FlyView;
    }(Views.ViewBase));
    Views.FlyView = FlyView;
})(Views || (Views = {}));
//# sourceMappingURL=FlyView.js.map