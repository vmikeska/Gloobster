var Planning;
(function (Planning) {
    var DealsSearch = (function () {
        function DealsSearch() {
            this.$mainCont = $("#categoryCont");
            this.createLayout();
            this.$resultsCont = $("#resultsCont");
            this.$filter = $("#filterCont");
        }
        Object.defineProperty(DealsSearch.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        DealsSearch.prototype.createLayout = function () {
            var tmp = this.v.registerTemplate("deals-template");
            var $deals = $(tmp());
            this.$mainCont.html($deals);
        };
        DealsSearch.prototype.showAirsFirst = function () {
            var id = new Common.InfoDialog();
            id.create(this.v.t("NoAirsTitle", "jsDeals"), this.v.t("NoAirsBody", "jsDeals"));
        };
        Object.defineProperty(DealsSearch.prototype, "hasAirs", {
            get: function () {
                return this.locDlg.hasAirports();
            },
            enumerable: true,
            configurable: true
        });
        DealsSearch.prototype.init = function () {
            var _this = this;
            this.resultsEngine = new Planning.ResultsManager();
            this.resultsEngine.onDrawQueue = function () {
                var qv = new Planning.QueueVisualize();
                if (any(_this.resultsEngine.queue)) {
                    qv.draw(_this.resultsEngine.timeType, _this.resultsEngine.queue);
                }
                else {
                    qv.hide();
                }
            };
            this.resultsEngine.onResultsChanged = function (queries) {
                _this.currentSetter.setQueries(queries);
                var de = new Planning.DelasEval(_this.resultsEngine.timeType, queries);
                de.dispayDeals();
            };
            this.planningMap = new Planning.PlanningMap(this);
            this.planningMap.onMapLoaded = function () {
                _this.changeSetter(PlanningType.Anytime);
            };
            this.planningMap.onSelectionChanged = function (id, newState, type) {
                var customId = _this.currentSetter.getCustomId();
                _this.resultsEngine.selectionChanged(id, newState, type, customId);
            };
            this.planningMap.init();
            this.mapSwitch(function (type) {
                _this.planningMap.changeViewType(type);
            });
            this.locDlg = new Planning.LocationSettingsDialog(this);
            this.initDealsTabs();
        };
        DealsSearch.prototype.enableMap = function (state) {
            var disabler = $("#mapDisabler");
            if (state) {
                disabler.removeClass("map-disabled");
            }
            else {
                disabler.addClass("map-disabled");
            }
        };
        DealsSearch.prototype.mapSwitch = function (callback) {
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
        DealsSearch.prototype.initDealsTabs = function () {
            var _this = this;
            this.tabs = new Common.Tabs($("#naviCont"), "main");
            this.tabs.initCall = false;
            this.tabs.onBeforeSwitch = function () {
                _this.enableMap(true);
                _this.$resultsCont.empty();
                _this.$filter.empty();
            };
            this.tabs.addTab("tabAnytime", this.v.t("TabAnytime", "jsDeals"), function () {
                _this.changeSetter(PlanningType.Anytime);
            });
            this.tabs.addTab("tabWeekend", this.v.t("TabWeekend", "jsDeals"), function () {
                _this.changeSetter(PlanningType.Weekend);
            });
            this.tabs.addTab("tabCustom", this.v.t("TabCustom", "jsDeals"), function () {
                _this.changeSetter(PlanningType.Custom);
            });
            this.tabs.create();
        };
        DealsSearch.prototype.changeSetter = function (type) {
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
                var customId = _this.currentSetter.getCustomId();
                _this.resultsEngine.initalCall(type, customId);
            });
        };
        return DealsSearch;
    }());
    Planning.DealsSearch = DealsSearch;
})(Planning || (Planning = {}));
//# sourceMappingURL=DealsSearch.js.map