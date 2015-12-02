var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var ShareTripView = (function (_super) {
        __extends(ShareTripView, _super);
        function ShareTripView() {
            _super.call(this);
            this.initialize();
        }
        ShareTripView.prototype.initialize = function () {
            this.maps = new Maps.MapsCreatorMapBox2D();
            this.maps.setRootElement("map");
            this.maps.show(function (map) {
                //this.mapsOperations = new PlanningMap(map);
                //this.mapsOperations.loadCategory(PlanningType.Anytime);
            });
        };
        return ShareTripView;
    })(Views.ViewBase);
    Views.ShareTripView = ShareTripView;
})(Views || (Views = {}));
//# sourceMappingURL=ShareTripView.js.map