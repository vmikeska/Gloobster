var Views;
(function (Views) {
    var ShareDialogView = (function () {
        function ShareDialogView() {
            var _this = this;
            this.$dialog = $("#popup-share");
            this.shareButtons = new Common.ShareButtons($("#shareCont"), "Share on social media");
            $("#share").click(function () { return _this.share(); });
        }
        ShareDialogView.prototype.share = function () {
            var _this = this;
            var networks = this.shareButtons.getSelectedNetworks();
            var data = {
                message: $("#message").val(),
                tripId: Views.ViewBase.currentView["trip"].tripId,
                networks: networks,
                allowRequestJoin: $("#allowRequestJoin").prop("checked")
            };
            Views.ViewBase.currentView.apiPost("TripSocNetworks", data, function (response) {
                _this.$dialog.hide();
            });
        };
        return ShareDialogView;
    })();
    Views.ShareDialogView = ShareDialogView;
})(Views || (Views = {}));
//# sourceMappingURL=ShareDialogView.js.map