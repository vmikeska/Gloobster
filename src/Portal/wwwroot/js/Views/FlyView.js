var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var FlyView = (function (_super) {
        __extends(FlyView, _super);
        function FlyView() {
            _super.call(this);
            this.$cont = $("#resultsCont");
            this.$filter = $("#filterCont");
            this.initialize();
            var cf = new Planning.CustomFrom(this);
        }
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
            if (type === PlanningType.Anytime) {
                this.currentSetter = new Planning.AnytimePageSetter(this);
            }
            if (type === PlanningType.Weekend) {
                this.currentSetter = new Planning.WeekendPageSetter(this);
            }
            if (type === PlanningType.Custom) {
                this.currentSetter = new Planning.CustomPageSetter(this);
            }
            this.currentSetter.init();
            this.planningMap.loadCategory(type);
            this.resultsEngine.initalCall(type);
        };
        FlyView.prototype.initialize = function () {
            var _this = this;
            this.resultsEngine = new Planning.ResultsManager();
            this.resultsEngine.onConnectionsChanged = function (connections) {
                _this.currentSetter.setConnections(connections);
            };
            this.planningMap = new Planning.PlanningMap();
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
            var locationDialog = new Views.LocationSettingsDialog();
            this.initTabs();
        };
        return FlyView;
    }(Views.ViewBase));
    Views.FlyView = FlyView;
})(Views || (Views = {}));
//# sourceMappingURL=FlyView.js.map