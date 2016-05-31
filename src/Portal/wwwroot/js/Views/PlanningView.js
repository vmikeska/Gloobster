var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var PlanningData = (function () {
        function PlanningData() {
            this.resultsEngine = new Planning.ResultsManager();
            this.$tabsCont = $("#tabsCont");
            this.$cont = $("#results2");
        }
        PlanningData.prototype.onSelectionChagned = function (id, newState, type) {
            if (newState) {
                this.resultsEngine.selectionChanged(id, newState, type);
            }
        };
        PlanningData.prototype.onMapTypeChanged = function (type) {
            this.$tabsCont.html("");
            this.$cont.html("");
            if (type === Planning.PlanningType.Anytime) {
                this.showAnytime();
            }
            if (type === Planning.PlanningType.Weekend) {
                this.showWeekend();
            }
        };
        PlanningData.prototype.showAnytime = function () {
            var _this = this;
            var display = new Planning.AnytimeDisplay(this.$cont);
            this.resultsEngine.initalCall(0);
            this.resultsEngine.onConnectionsChanged = function (connections) {
                _this.$cont.html("");
                display.render(_this.resultsEngine.connections);
            };
        };
        PlanningData.prototype.showWeekend = function () {
            var _this = this;
            this.tabsWeekendViews = new TabsWeekendViews(this.$tabsCont);
            this.resultsEngine.initalCall(1);
            this.resultsEngine.onConnectionsChanged = function (connections) {
                var t = _this.tabsWeekendViews.currentTab;
                _this.renderWeekend(t);
            };
            this.tabsWeekendViews.onTabSwitched = function (t) {
                _this.$cont.html("");
                _this.renderWeekend(t);
            };
        };
        PlanningData.prototype.renderWeekend = function (t) {
            if (t === TabsWeekendType.ByWeek) {
                var d1 = new Planning.WeekendByWeekDisplay(this.$cont);
                d1.render(this.resultsEngine.connections);
            }
            if (t === TabsWeekendType.ByCity) {
                var d2 = new Planning.WeekendByCityDisplay(this.$cont);
                d2.render(this.resultsEngine.connections);
            }
            if (t === TabsWeekendType.ByCountry) {
                var d3 = new Planning.WeekendByCountryDisplay(this.$cont);
                d3.render(this.resultsEngine.connections);
            }
        };
        return PlanningData;
    }());
    Views.PlanningData = PlanningData;
    var PlanningView = (function (_super) {
        __extends(PlanningView, _super);
        function PlanningView() {
            var _this = this;
            _super.call(this);
            this.planningData = new PlanningData();
            this.initialize();
            this.tabsTime = new TabsTime();
            this.tabsTime.onTabSwitched = (function (tabType) {
                _this.planningMap.loadCategory(tabType);
            });
        }
        PlanningView.prototype.initialize = function () {
            var _this = this;
            this.maps = new Maps.MapsCreatorMapBox2D();
            this.maps.setRootElement("map");
            this.maps.show(function (map) {
                _this.planningMap = new Planning.PlanningMap(map);
                _this.planningMap.onSelectionChanged = function (id, newState, type) {
                    _this.planningData.onSelectionChagned(id, newState, type);
                };
                _this.planningMap.onMapTypeChanged = function (type) { return _this.planningData.onMapTypeChanged(type); };
                _this.planningMap.loadCategory(Planning.PlanningType.Anytime);
            });
            var locationDialog = new Views.LocationSettingsDialog();
        };
        return PlanningView;
    }(Views.ViewBase));
    Views.PlanningView = PlanningView;
    var TabsTime = (function () {
        function TabsTime() {
            this.registerTabEvents();
        }
        TabsTime.prototype.registerTabEvents = function () {
            var _this = this;
            this.anytimeTabTemplate = Views.ViewBase.currentView.registerTemplate("anytime-template");
            this.weekendTabTemplate = Views.ViewBase.currentView.registerTemplate("weekend-template");
            this.customTabTemplate = Views.ViewBase.currentView.registerTemplate("custom-template");
            var $tabsRoot = $("#TimeTab");
            var $tabs = $tabsRoot.find(".tab");
            $tabs.click(function (e) {
                e.preventDefault();
                _this.switchTab($(e.delegateTarget), $tabs);
            });
        };
        TabsTime.prototype.switchTab = function ($target, $tabs) {
            $tabs.removeClass("active");
            $target.addClass("active");
            var tabType = parseInt($target.data("type"));
            var tabHtml = "";
            if (tabType === Planning.PlanningType.Anytime) {
                tabHtml = this.anytimeTabTemplate();
            }
            if (tabType === Planning.PlanningType.Weekend) {
                tabHtml = this.weekendTabTemplate();
            }
            if (tabType === Planning.PlanningType.Custom) {
                tabHtml = this.customTabTemplate();
            }
            var $tabContent = $("#tabContent");
            $tabContent.html(tabHtml);
            if (this.onTabSwitched) {
                this.onTabSwitched(tabType);
            }
        };
        return TabsTime;
    }());
    Views.TabsTime = TabsTime;
    var TabsWeekendViews = (function () {
        function TabsWeekendViews($tabsCont) {
            this.currentTab = TabsWeekendType.ByWeek;
            this.tabsTemplate = Views.ViewBase.currentView.registerTemplate("weekendTabs-template");
            $tabsCont.html(this.tabsTemplate);
            this.registerTabEvents();
        }
        TabsWeekendViews.prototype.registerTabEvents = function () {
            var _this = this;
            var $tabsRoot = $("#TabsWeekendTime");
            var $tabs = $tabsRoot.find(".tab");
            $tabs.click(function (e) {
                e.preventDefault();
                _this.switchTab($(e.delegateTarget), $tabs);
            });
        };
        TabsWeekendViews.prototype.switchTab = function ($target, $tabs) {
            $tabs.removeClass("active");
            $target.addClass("active");
            var tabType = parseInt($target.data("type"));
            var tabHtml = "";
            var $tabContent = $("#tabContent");
            $tabContent.html(tabHtml);
            this.currentTab = tabType;
            if (this.onTabSwitched) {
                this.onTabSwitched(tabType);
            }
        };
        return TabsWeekendViews;
    }());
    Views.TabsWeekendViews = TabsWeekendViews;
})(Views || (Views = {}));
//# sourceMappingURL=PlanningView.js.map