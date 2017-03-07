var Common;
(function (Common) {
    var CustomDialog = (function () {
        function CustomDialog() {
        }
        CustomDialog.prototype.init = function ($html, title, custClass) {
            var _this = this;
            if (custClass === void 0) { custClass = ""; }
            var t = Views.ViewBase.currentView.registerTemplate("custom-dialog-template");
            var context = {
                title: title,
                custClass: custClass
            };
            this.$t = $(t(context));
            this.$dlgFrameAll = this.$t.find(".dlg-frame-all");
            $("body").append(this.$t);
            this.$t.find(".dlg-cont").html($html);
            this.$dlgFrameAll.fadeIn();
            this.$t.click(function (e) {
                var isOut = e.target.className === "popup3";
                if (isOut) {
                    e.preventDefault();
                    _this.close();
                }
            });
            this.$t.find(".close").click(function (e) {
                _this.close();
            });
        };
        CustomDialog.prototype.addBtn = function (txt, cls, callback) {
            var $b = $("<a href=\"#\" class=\"lbtn2 " + cls + "\">" + txt + "</a>");
            this.$t.find(".dlg-btns").append($b);
            $b.click(function (e) {
                e.preventDefault();
                callback();
            });
        };
        CustomDialog.prototype.close = function () {
            var _this = this;
            this.$dlgFrameAll.fadeOut(function () {
                _this.$t.remove();
            });
        };
        return CustomDialog;
    }());
    Common.CustomDialog = CustomDialog;
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
            $("body").append(this.$html);
        };
        return HintDialog;
    }());
    Common.HintDialog = HintDialog;
    var UploadDialog = (function () {
        function UploadDialog() {
            this.visible = false;
        }
        UploadDialog.prototype.create = function () {
            var t = Views.ViewBase.currentView.registerTemplate("upload-dialog-template");
            this.$html = $(t());
            this.$progresBar = this.$html.find("#progressBar");
            this.$progresBar.show();
            this.$html.show();
            $("body").append(this.$html);
            this.visible = true;
        };
        UploadDialog.prototype.update = function (percent) {
            if (this.$html) {
                var pt = percent + "%";
                this.$progresBar.find(".progress").css("width", pt);
                this.$progresBar.find("span").text(pt);
            }
        };
        UploadDialog.prototype.destroy = function () {
            if (this.$html) {
                this.$html.remove();
                this.visible = false;
            }
        };
        return UploadDialog;
    }());
    Common.UploadDialog = UploadDialog;
    var InprogressDialog = (function () {
        function InprogressDialog() {
            this.template = Views.ViewBase.currentView.registerTemplate("inPorgressDialog-template");
        }
        InprogressDialog.prototype.create = function (message, $before) {
            this.$html = $(this.template({ message: message }));
            $before.before(this.$html);
        };
        InprogressDialog.prototype.remove = function () {
            this.$html.remove();
        };
        return InprogressDialog;
    }());
    Common.InprogressDialog = InprogressDialog;
    var ErrorDialog = (function () {
        function ErrorDialog() {
        }
        ErrorDialog.show = function (error) {
            var v = Views.ViewBase.currentView;
            var tmp = v.registerTemplate("error-dialog-template");
            var $h = $(tmp({ error: error }));
            $("body").append($h);
            $h.find(".refresh-btn").click(function (e) {
                e.preventDefault();
                window.location.reload(true);
            });
        };
        return ErrorDialog;
    }());
    Common.ErrorDialog = ErrorDialog;
    var InfoDialog = (function () {
        function InfoDialog() {
            this.template = Views.ViewBase.currentView.registerTemplate("infoDialog-template");
        }
        InfoDialog.prototype.create = function (title, text, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            var context = {
                title: title,
                text: text
            };
            this.$html = $(this.template(context));
            this.$html.find(".cancel").click(function (e) {
                e.preventDefault();
                if (callback) {
                    callback();
                }
                _this.$html.fadeOut();
            });
            $("body").append(this.$html);
            this.$html.fadeIn();
        };
        InfoDialog.prototype.hide = function () {
            this.$html.hide();
        };
        return InfoDialog;
    }());
    Common.InfoDialog = InfoDialog;
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
    }());
    Common.ConfirmDialog = ConfirmDialog;
})(Common || (Common = {}));
//# sourceMappingURL=ConfirmDialog.js.map