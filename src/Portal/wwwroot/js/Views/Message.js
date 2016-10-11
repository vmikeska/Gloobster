var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var Messages = (function (_super) {
        __extends(Messages, _super);
        function Messages(otherUserId) {
            var _this = this;
            _super.call(this);
            this.msgTmp = Views.ViewBase.currentView.registerTemplate("msgPost-template");
            this.otherUserId = otherUserId;
            this.refresh();
            $("#commentSubmit").click(function (e) {
                e.preventDefault();
                var msg = $("#commentInput").val();
                _this.sendMessage(_this.otherUserId, msg);
            });
        }
        Messages.prototype.refresh = function () {
            var _this = this;
            var prms = [["userId", this.otherUserId]];
            this.apiGet("Message", prms, function (rs) {
                _this.displayMessages(rs.messages);
            });
        };
        Messages.prototype.sendMessage = function (userId, message) {
            var _this = this;
            var data = {
                userId: userId,
                message: message
            };
            this.apiPost("Message", data, function (rs) {
                _this.displayMessages(rs.messages);
                $("#commentInput").val("");
            });
        };
        Messages.prototype.displayMessages = function (messages) {
            var _this = this;
            var $cont = $("#msgsCont");
            $cont.html("");
            messages.forEach(function (r) {
                var context = {
                    dateFormatted: moment(r.date).format("lll"),
                    message: r.message,
                    name: r.name,
                    userId: r.userId,
                    showUnread: !r.read && (r.userId !== Views.ViewBase.currentUserId)
                };
                var $m = $(_this.msgTmp(context));
                $cont.prepend($m);
            });
        };
        return Messages;
    }(Views.ViewBase));
    Views.Messages = Messages;
})(Views || (Views = {}));
//# sourceMappingURL=Message.js.map