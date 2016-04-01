var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TwitterAuthView = (function (_super) {
        __extends(TwitterAuthView, _super);
        function TwitterAuthView() {
            _super.call(this);
            this.twInterval = null;
            this.cookiesSaver = new Reg.AuthCookieSaver();
        }
        Object.defineProperty(TwitterAuthView.prototype, "pageType", {
            get: function () { return Views.PageType.TwitterAuth; },
            enumerable: true,
            configurable: true
        });
        TwitterAuthView.prototype.onResponse = function (resp) {
            var _this = this;
            var data = resp;
            this.apiPost("TwitterUser", data, function (r) {
                _this.cookiesSaver.saveTwitterLogged();
                _this.cookiesSaver.saveCookies(r);
                _this.twitterLoginWatch(function () {
                    close();
                });
            });
        };
        TwitterAuthView.prototype.twitterLoginWatch = function (callback) {
            var _this = this;
            this.twInterval = setInterval(function () {
                var isLogged = _this.cookiesSaver.isTwitterLogged();
                if (isLogged) {
                    clearInterval(_this.twInterval);
                    callback();
                }
            }, 500);
        };
        return TwitterAuthView;
    })(Views.ViewBase);
    Views.TwitterAuthView = TwitterAuthView;
})(Views || (Views = {}));
//# sourceMappingURL=TwitterAuthView.js.map