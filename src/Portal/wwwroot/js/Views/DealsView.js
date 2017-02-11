var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var DealsView = (function (_super) {
        __extends(DealsView, _super);
        function DealsView() {
            _super.call(this);
            var cs = new Planning.ClassicSearch();
            cs.init();
        }
        return DealsView;
    }(Views.ViewBase));
    Views.DealsView = DealsView;
})(Views || (Views = {}));
//# sourceMappingURL=DealsView.js.map