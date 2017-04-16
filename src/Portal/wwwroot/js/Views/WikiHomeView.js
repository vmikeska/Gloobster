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
            this.regMoreBtn();
        }
        WikiHomeView.prototype.regMoreBtn = function () {
            var _this = this;
            $(".more-btn").click(function (e) {
                _this.changeInfoVisibility();
            });
            $(".close").click(function (e) {
                _this.changeInfoVisibility();
            });
        };
        WikiHomeView.prototype.changeInfoVisibility = function () {
            $(".wiki-info-all").toggleClass("collapsed");
        };
        return WikiHomeView;
    }(Views.ViewBase));
    Views.WikiHomeView = WikiHomeView;
})(Views || (Views = {}));
//# sourceMappingURL=WikiHomeView.js.map