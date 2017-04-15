var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var StatsView = (function (_super) {
        __extends(StatsView, _super);
        function StatsView() {
            _super.apply(this, arguments);
        }
        StatsView.prototype.init = function (scriptName) {
            this.createMap(scriptName);
        };
        StatsView.prototype.createMap = function (scriptName) {
            var options = {
                zoom: 3,
                maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
                zoomControl: false,
                center: [34.5133, -94.1629]
            };
            this.mapObj = L.map("statMap", options);
            var statInstance = Stats.InstanceLoader.getInstance(window["Stats"], scriptName, this.mapObj);
        };
        return StatsView;
    }(Views.ViewBase));
    Views.StatsView = StatsView;
})(Views || (Views = {}));
//# sourceMappingURL=StatsView.js.map