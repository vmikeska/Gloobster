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
            this.otherUserId = otherUserId;
            this.msgTmp = this.registerTemplate("msgPost-template");
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
            });
        };
        Messages.prototype.displayMessages = function (messages) {
            var _this = this;
            var $cont = $("#msgsCont");
            $cont.html("");
            messages.forEach(function (r) {
                var $m = $(_this.msgTmp(r));
                $cont.prepend($m);
            });
        };
        return Messages;
    }(Views.ViewBase));
    Views.Messages = Messages;
})(Views || (Views = {}));
//# sourceMappingURL=Messages.js.map