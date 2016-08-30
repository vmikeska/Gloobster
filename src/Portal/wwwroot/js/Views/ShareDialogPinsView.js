var Views;
(function (Views) {
    var ShareDialogPinsView = (function () {
        function ShareDialogPinsView() {
            var _this = this;
            this.$dialog = $("#popup-share");
            this.shareButtons = new Common.ShareButtons($(".share-cont"));
            this.shareButtons.onSelectionChanged = function (nets) {
                _this.fillSocStr(nets);
            };
            var v = Views.ViewBase.currentView;
            $("#share").click(function () {
                var id = new Common.InprogressDialog();
                _this.$dialog.hide();
                id.create(v.t("SharingMap", "jsPins"));
                _this.share(function () {
                    id.remove();
                    var hd = new Common.HintDialog();
                    hd.create(v.t("MapShared", "jsPins"));
                });
            });
            this.fillSocStr(this.shareButtons.getStr());
        }
        ShareDialogPinsView.prototype.fillSocStr = function (str) {
            $("#share").find("span").html(str);
        };
        ShareDialogPinsView.prototype.share = function (callback) {
            var networks = this.shareButtons.getSelectedNetworks();
            var data = {
                message: $("#message").val(),
                networks: networks
            };
            Views.ViewBase.currentView.apiPost("PinBoardShare", data, function (response) {
                callback();
            });
        };
        return ShareDialogPinsView;
    }());
    Views.ShareDialogPinsView = ShareDialogPinsView;
})(Views || (Views = {}));
//# sourceMappingURL=ShareDialogPinsView.js.map