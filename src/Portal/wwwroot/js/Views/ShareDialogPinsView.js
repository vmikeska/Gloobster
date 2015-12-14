var Views;
(function (Views) {
    var ShareDialogPinsView = (function () {
        function ShareDialogPinsView() {
            var _this = this;
            this.$dialog = $("#popup-share");
            this.shareButtons = new Common.ShareButtons($("#shareCont"), "Share on social media");
            $("#share").click(function () { return _this.share(); });
        }
        ShareDialogPinsView.prototype.share = function () {
            var _this = this;
            var networks = this.shareButtons.getSelectedNetworks();
            var data = {
                message: $("#message").val(),
                networks: networks
            };
            Views.ViewBase.currentView.apiPost("PinBoardShare", data, function (response) {
                _this.$dialog.hide();
            });
        };
        return ShareDialogPinsView;
    })();
    Views.ShareDialogPinsView = ShareDialogPinsView;
})(Views || (Views = {}));
//# sourceMappingURL=ShareDialogPinsView.js.map