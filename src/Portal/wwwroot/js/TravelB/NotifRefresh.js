var Views;
(function (Views) {
    var NotifRefresh = (function () {
        function NotifRefresh() {
            this.refreshCycleFinished = true;
            this.lastRefreshDate = null;
        }
        NotifRefresh.prototype.startRefresh = function () {
            var _this = this;
            var i = setInterval(function () {
                if (!_this.refreshCycleFinished) {
                    return;
                }
                else {
                    _this.refreshCycleFinished = false;
                }
                _this.onRefresh(function () {
                    _this.refreshCycleFinished = true;
                });
            }, 10000);
        };
        return NotifRefresh;
    }());
    Views.NotifRefresh = NotifRefresh;
})(Views || (Views = {}));
//# sourceMappingURL=NotifRefresh.js.map