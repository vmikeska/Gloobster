var Common;
(function (Common) {
    var HintDialog = (function () {
        function HintDialog() {
            this.template = Views.ViewBase.currentView.registerTemplate("hint-template");
        }
        HintDialog.prototype.create = function (message) {
            var _this = this;
            this.$html = $(this.template({ message: message }));
            this.$html.find(".close").click(function (e) {
                e.preventDefault();
                _this.$html.remove();
            });
            $("section").first().prepend(this.$html);
        };
        return HintDialog;
    })();
    Common.HintDialog = HintDialog;
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
                _this.$html.fadeOut();
            });
            this.$html.find(".cancel").click(function (e) {
                e.preventDefault();
                _this.$html.fadeOut();
            });
            $("body").append(this.$html);
            this.$html.fadeIn();
        };
        ConfirmDialog.prototype.hide = function () {
            this.$html.hide();
        };
        return ConfirmDialog;
    })();
    Common.ConfirmDialog = ConfirmDialog;
})(Common || (Common = {}));
//# sourceMappingURL=ConfirmDialog.js.map