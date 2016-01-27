var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var NotificationsView = (function (_super) {
        __extends(NotificationsView, _super);
        function NotificationsView() {
            _super.call(this);
            this.registerDelButtons();
            this.registerDelAllButton();
        }
        NotificationsView.prototype.registerDelButtons = function () {
            var _this = this;
            $(".notif_delete").click(function (e) {
                e.preventDefault();
                var $btn = $(e.target);
                var notifId = $btn.data("notifid");
                var prms = [["id", notifId]];
                _this.apiDelete("notification", prms, function (r) {
                    var $notif = $("#" + notifId);
                    $notif.remove();
                    _this.setForm(parseInt(r));
                });
            });
        };
        NotificationsView.prototype.registerDelAllButton = function () {
            var _this = this;
            $("#deleteAll").click(function (e) {
                e.preventDefault();
                var prms = [["deleteAll", "true"]];
                _this.apiDelete("notification", prms, function (r) {
                    var $notif = $(".notif_item");
                    $notif.remove();
                    _this.setForm(parseInt(r));
                });
            });
        };
        NotificationsView.prototype.setForm = function (notifCnt) {
            if (notifCnt === 0) {
                $("#notifCont").html("<div>You have no new notifications</div>");
                $("#deleteAll").hide();
            }
        };
        return NotificationsView;
    })(Views.ViewBase);
    Views.NotificationsView = NotificationsView;
})(Views || (Views = {}));
//# sourceMappingURL=NotificationsView.js.map