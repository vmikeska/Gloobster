var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiHomeView = (function (_super) {
        __extends(WikiHomeView, _super);
        function WikiHomeView() {
            _super.call(this);
            this.combo = new Views.WikiSearchCombo();
            this.combo.initId("SearchCombo", { showRating: true });
        }
        return WikiHomeView;
    }(Views.ViewBase));
    Views.WikiHomeView = WikiHomeView;
})(Views || (Views = {}));
//# sourceMappingURL=WikiHomeView.js.map