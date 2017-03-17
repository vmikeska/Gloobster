var Views;
(function (Views) {
    var ShareDialogPins = (function () {
        function ShareDialogPins() {
            var _this = this;
            var v = Views.ViewBase.currentView;
            var t = v.registerTemplate("pins-share-template");
            this.$html = $(t());
            var cd = new Common.CustomDialog();
            cd.init(this.$html, v.t("ShareTitle", "jsPins"), "share-dlg");
            this.shareButtons = new Common.ShareButtons($(".share-cont"));
            this.shareButtons.onSelectionChanged = function (nets) {
                _this.fillSocStr(nets);
            };
            cd.addBtn(v.t("ShareBtn", "jsPins"), "green-orange", function () {
                cd.close();
                _this.share(function () {
                    var hd = new Common.HintDialog();
                    hd.create(v.t("MapShared", "jsPins"));
                });
            });
            this.fillSocStr(this.shareButtons.getStr());
        }
        ShareDialogPins.prototype.fillSocStr = function (str) {
            $("#share").find("span").html(str);
        };
        ShareDialogPins.prototype.share = function (callback) {
            var networks = this.shareButtons.getSelectedNetworks();
            var data = {
                message: this.$html.find("textarea").val(),
                networks: networks
            };
            Views.ViewBase.currentView.apiPost("PinBoardShare", data, function (response) {
                callback();
            });
        };
        return ShareDialogPins;
    }());
    Views.ShareDialogPins = ShareDialogPins;
})(Views || (Views = {}));
//# sourceMappingURL=ShareDialogPins.js.map