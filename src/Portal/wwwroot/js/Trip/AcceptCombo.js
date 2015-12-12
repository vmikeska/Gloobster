var Trip;
(function (Trip) {
    var AcceptComboConfig = (function () {
        function AcceptComboConfig() {
        }
        return AcceptComboConfig;
    })();
    Trip.AcceptComboConfig = AcceptComboConfig;
    var AcceptCombo = (function () {
        function AcceptCombo(config) {
            var _this = this;
            this.config = config;
            this.$combo = $("#" + config.comboId);
            this.$ul = this.$combo.find("ul");
            this.$selected = this.$combo.find(".selected");
            this.initState(config.initialState);
            this.$ul.find("li").click(function (e) { return _this.onClick(e); });
        }
        AcceptCombo.prototype.onClick = function (e) {
            var $li = $(e.target);
            var val = $li.data("value");
            var data = {
                tripId: this.config.tripId,
                newState: parseInt(val)
            };
            Views.ViewBase.currentView.apiPut("TripInvitationState", data, function (res) {
            });
        };
        AcceptCombo.prototype.initState = function (state) {
            this.setHtmlContByState(state);
        };
        AcceptCombo.prototype.setHtmlContByState = function (state) {
            var $li = this.$ul.find("li[data-value=\"" + state + "\"]");
            this.$selected.html($li.html());
        };
        return AcceptCombo;
    })();
    Trip.AcceptCombo = AcceptCombo;
})(Trip || (Trip = {}));
//# sourceMappingURL=AcceptCombo.js.map