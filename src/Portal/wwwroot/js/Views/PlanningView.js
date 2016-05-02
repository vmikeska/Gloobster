var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var PlanningView = (function (_super) {
        __extends(PlanningView, _super);
        function PlanningView() {
            _super.call(this);
            this.initialize();
            this.registerTabEvents();
        }
        PlanningView.prototype.initialize = function () {
            var _this = this;
            this.maps = new Maps.MapsCreatorMapBox2D();
            this.maps.setRootElement("map");
            this.maps.show(function (map) {
                _this.mapsOperations = new Planning.PlanningMap(map);
                _this.mapsOperations.loadCategory(Planning.PlanningType.Anytime);
            });
            var locationDialog = new Views.LocationSettingsDialog();
        };
        PlanningView.prototype.registerTabEvents = function () {
            var _this = this;
            this.anytimeTabTemplate = Views.ViewBase.currentView.registerTemplate("anytime-template");
            this.weekendTabTemplate = Views.ViewBase.currentView.registerTemplate("weekend-template");
            this.customTabTemplate = Views.ViewBase.currentView.registerTemplate("custom-template");
            var $tabsRoot = $(".tabs");
            var $tabs = $tabsRoot.find(".tab");
            $tabs.click(function (e) { _this.switchTab($(e.delegateTarget), $tabs); });
        };
        PlanningView.prototype.switchTab = function ($target, $tabs) {
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
            this.onTabSwitched(tabType);
        };
        PlanningView.prototype.onTabSwitched = function (tabType) {
            this.mapsOperations.loadCategory(tabType);
        };
        return PlanningView;
    }(Views.ViewBase));
    Views.PlanningView = PlanningView;
})(Views || (Views = {}));
//# sourceMappingURL=PlanningView.js.map