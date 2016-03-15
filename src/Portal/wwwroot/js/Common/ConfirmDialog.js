var Common;
(function (Common) {
    var ConfirmDialog = (function () {
        function ConfirmDialog() {
            this.template = Views.ViewBase.currentView.registerTemplate("confirmDialog-template");
        }
        ConfirmDialog.prototype.create = function (title, text, textCancel, textOk, okCallback) {
            var _this = this;
            var context = {
                title: title,
                text: text,
                textCancel: textCancel,
                textOk: textOk
            };
            this.$html = $(this.template(context));
            this.$html.find(".confirm").click(function (e) {
                e.preventDefault();
                okCallback(_this.$html);
            });
            this.$html.find(".cancel").click(function (e) {
                e.preventDefault();
                _this.$html.remove();
            });
            $("body").append(this.$html);
            this.$html.fadeIn();
        };
        return ConfirmDialog;
    })();
    Common.ConfirmDialog = ConfirmDialog;
})(Common || (Common = {}));
//# sourceMappingURL=ConfirmDialog.js.map