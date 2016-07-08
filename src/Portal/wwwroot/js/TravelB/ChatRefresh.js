var Views;
(function (Views) {
    var NotificationRefresh = (function () {
        function NotificationRefresh() {
            this.refreshCycleFinished = true;
            this.lastRefreshDate = null;
        }
        NotificationRefresh.prototype.startRefresh = function () {
            var _this = this;
            this.notif = new Views.CheckinReacts();
            var i = setInterval(function () {
                if (!_this.refreshCycleFinished) {
                    return;
                }
                else {
                    _this.refreshCycleFinished = false;
                }
                var chatWins = $(".chat-cont").toArray();
                if (chatWins.length === 0) {
                    clearInterval(i);
                }
                _this.notif.refreshReacts(function () {
                    _this.refreshCycleFinished = true;
                });
            }, 5000);
        };
        return NotificationRefresh;
    }());
    Views.NotificationRefresh = NotificationRefresh;
    var ChatRefresh = (function () {
        function ChatRefresh() {
            this.refreshCycleFinished = true;
            this.lastRefreshDate = null;
        }
        ChatRefresh.prototype.startRefresh = function () {
            var _this = this;
            var i = setInterval(function () {
                if (!_this.refreshCycleFinished) {
                    return;
                }
                else {
                    _this.refreshCycleFinished = false;
                }
                var chatWins = $(".chat-cont").toArray();
                if (chatWins.length === 0) {
                    clearInterval(i);
                }
                var loadedIds = _.map(chatWins, function (w) { return $(w).data("id"); });
                var prms = [];
                var lastDate = null;
                loadedIds.forEach(function (rid) {
                    prms.push(["reactIds", rid]);
                    var ld = Views.Chat.getChatByRectId(rid).data("last");
                    if (lastDate === null) {
                        lastDate = ld;
                    }
                    else if (ld > lastDate) {
                        lastDate = ld;
                    }
                });
                if (lastDate) {
                    prms.push(["lastDate", lastDate.toString()]);
                }
                Views.ViewBase.currentView.apiGet("ReactChat", prms, function (responses) {
                    _this.onRefresh(responses);
                    _this.refreshCycleFinished = true;
                });
            }, 5000);
        };
        return ChatRefresh;
    }());
    Views.ChatRefresh = ChatRefresh;
})(Views || (Views = {}));
//# sourceMappingURL=ChatRefresh.js.map