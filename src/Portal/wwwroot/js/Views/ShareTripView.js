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
        }
        PlanningView.prototype.initialize = function () {
            this.maps = new Maps.MapsCreatorMapBox2D();
            this.maps.setRootElement("map");
            this.maps.show(function (map) {
                //this.mapsOperations = new PlanningMap(map);
                //this.mapsOperations.loadCategory(PlanningType.Anytime);
            });
        };
        return PlanningView;
    })(Views.ViewBase);
    Views.PlanningView = PlanningView;
})(Views || (Views = {}));
//# sourceMappingURL=ShareTripView.js.map