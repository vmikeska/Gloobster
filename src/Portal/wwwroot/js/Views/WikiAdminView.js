var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiAdminView = (function (_super) {
        __extends(WikiAdminView, _super);
        function WikiAdminView() {
            _super.call(this);
            this.regActionButtons();
        }
        WikiAdminView.prototype.regActionButtons = function () {
            var _this = this;
            $(".actionButton").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var name = $target.data("action");
                var $cont = $target.closest(".task");
                var id = $cont.attr("id");
                var data = {
                    action: name,
                    id: id
                };
                _this.apiPost("AdminAction", data, function (r) {
                    if (r) {
                        $("#" + id).remove();
                    }
                });
            });
        };
        WikiAdminView.prototype.callAction = function (taskId, action) {
        };
        return WikiAdminView;
    })(Views.ViewBase);
    Views.WikiAdminView = WikiAdminView;
})(Views || (Views = {}));
//# sourceMappingURL=WikiAdminView.js.map