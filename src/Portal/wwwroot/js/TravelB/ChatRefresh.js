var Views;
(function (Views) {
    var ChatRefresh = (function () {
        function ChatRefresh() {
            this.refreshCycleFinished = true;
            this.lastRefreshDate = null;
            this.intRef = null;
        }
        Object.defineProperty(ChatRefresh.prototype, "isStarted", {
            get: function () {
                return this.intRef !== null;
            },
            enumerable: true,
            configurable: true
        });
        ChatRefresh.prototype.stopRefresh = function () {
            if (this.intRef) {
                clearInterval(this.intRef);
                this.intRef = null;
            }
        };
        ChatRefresh.prototype.startRefresh = function () {
            var _this = this;
            this.intRef = setInterval(function () {
                if (!_this.refreshCycleFinished) {
                    return;
                }
                else {
                    _this.refreshCycleFinished = false;
                }
                var persons = $(".nchat-all .people .person").toArray();
                if (persons.length === 0) {
                    _this.stopRefresh();
                }
                var loadedIds = _.map(persons, function (p) { return $(p).data("rid"); });
                var prms = [];
                var lastDate = null;
                loadedIds.forEach(function (rid) {
                    prms.push(["reactIds", rid]);
                    var ld = Views.Chat.getUserTitleNameTag(rid).data("last");
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