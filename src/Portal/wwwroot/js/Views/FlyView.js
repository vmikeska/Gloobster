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
            this.resultsEngine = new Planning.ResultsManager();
            this.initialize();
        }
        FlyView.prototype.initTabs = function () {
            var _this = this;
            this.tabs = new Planning.Tabs($("#naviCont"), "main", 50);
            this.tabs.onBeforeSwitch = function () {
                _this.$cont.empty();
                _this.$filter.empty();
            };
            this.tabs.addTab("tabAnytime", "Anytime", function () {
                _this.setAnytime();
            });
            this.tabs.addTab("tabWeekend", "Weekend", function () {
                _this.setWeekend();
            });
            this.tabs.addTab("tabCustom", "Custom", function () {
            });
            this.tabs.create();
        };
        FlyView.prototype.setAnytime = function () {
            var s = new Planning.AnytimePageSetter(this);
            s.init();
            this.planningMap.loadCategory(0);
            this.resultsEngine.initalCall(0);
            this.resultsEngine.onConnectionsChanged = function (connections) {
                s.setConnections(connections);
            };
        };
        FlyView.prototype.setWeekend = function () {
            var s = new Planning.WeekendPageSetter(this);
            s.init();
            this.planningMap.loadCategory(1);
            this.resultsEngine.initalCall(1);
            this.resultsEngine.onConnectionsChanged = function (connections) {
                s.setConnections(connections);
            };
        };
        FlyView.prototype.initialize = function () {
            var _this = this;
            this.maps = new Maps.MapsCreatorMapBox2D();
            this.maps.setRootElement("map");
            this.maps.show(function (map) {
                _this.planningMap = new Planning.PlanningMap(map);
                _this.planningMap.onSelectionChanged = function (id, newState, type) {
                    if (newState) {
                        _this.resultsEngine.selectionChanged(id, newState, type);
                    }
                };
                _this.planningMap.loadCategory(Planning.PlanningType.Anytime);
            });
            var locationDialog = new Views.LocationSettingsDialog();
            this.initTabs();
        };
        return FlyView;
    }(Views.ViewBase));
    Views.FlyView = FlyView;
})(Views || (Views = {}));
//# sourceMappingURL=FlyView.js.map