var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var IssuesView = (function (_super) {
        __extends(IssuesView, _super);
        function IssuesView() {
            _super.call(this);
            this.init();
        }
        IssuesView.prototype.init = function () {
            $(".set-act").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var $i = $t.closest(".issue");
                var isActive = $i.hasClass("active");
                $(".issue").removeClass("active");
                $(".issue-body").addClass("hidden");
                if (isActive) {
                    return;
                }
                $i.addClass("active");
                $i.find(".issue-body").removeClass("hidden");
            });
        };
        return IssuesView;
    }(Views.ViewBase));
    Views.IssuesView = IssuesView;
})(Views || (Views = {}));
//# sourceMappingURL=IssuesView.js.map