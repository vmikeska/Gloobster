var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var MessagesHome = (function (_super) {
        __extends(MessagesHome, _super);
        function MessagesHome() {
            _super.call(this);
            $(".um-all").click(function (e) {
                e.preventDefault();
                var $t = $(e.delegateTarget);
                var url = $t.data("url");
                window.location.href = url;
            });
        }
        return MessagesHome;
    }(Views.ViewBase));
    Views.MessagesHome = MessagesHome;
})(Views || (Views = {}));
//# sourceMappingURL=Messages.js.map