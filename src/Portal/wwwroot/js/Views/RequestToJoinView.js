var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var RequestToJoinView = (function (_super) {
        __extends(RequestToJoinView, _super);
        function RequestToJoinView() {
            var _this = this;
            _super.call(this);
            var dlg = new Common.InfoDialog();
            $("#reqBtn").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var data = { tid: $t.data("tid") };
                _this.apiPost("RequestTripInvitation", data, function (r) {
                    dlg.create(_this.t("ConfirmTitle", "jsTripJoin"), _this.t("ConfirmBody", "jsTripJoin"));
                });
            });
        }
        return RequestToJoinView;
    }(Views.ViewBase));
    Views.RequestToJoinView = RequestToJoinView;
})(Views || (Views = {}));
//# sourceMappingURL=RequestToJoinView.js.map